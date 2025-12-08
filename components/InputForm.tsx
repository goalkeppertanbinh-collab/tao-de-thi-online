import React, { useState, useRef, useMemo, useEffect } from "react";
import { TestParams, Topic, TestSetConfig, LevelCounts } from "../types";
import { GRADES, DURATIONS } from "../constants";
import { CURRICULUM_DATA, CurriculumStandard } from "../data/curriculumData";
import { extractTextFromFile } from "../utils/fileParser";
import { parseMatrixFromText } from "../services/geminiService";
import { 
  Key, Files, Settings2, Trash2, Upload, FileText, Grid3X3, List, Loader2, Wand2, CheckCircle, PenLine, CopyX, Plus, Calculator, MessageSquareText, BookOpen, X, FolderTree, Shuffle, Lightbulb, ListChecks
} from "lucide-react";

interface InputFormProps {
  params: TestParams;
  setParams: React.Dispatch<React.SetStateAction<TestParams>>;
  onGenerate: () => void;
  isLoading: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  params, setParams, onGenerate, isLoading, apiKey, setApiKey
}) => {
  const [newTopicName, setNewTopicName] = useState("");
  const [newParentTopic, setNewParentTopic] = useState(""); // State for Major Topic
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  // Removed showApiKey state
  const [matrixTab, setMatrixTab] = useState<"manual" | "file">("manual");
  const [inputMode, setInputMode] = useState<"select" | "text">("select"); // Toggle between Dropdown and Manual Text
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state for selected file
  
  // Suggestions State
  const [selectedStandard, setSelectedStandard] = useState<CurriculumStandard | null>(null);

  // Matrix input buffer
  const [matrixInput, setMatrixInput] = useState<string[][]>(Array(4).fill(null).map(() => Array(3).fill("")));
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DERIVED DATA FOR DROPDOWNS ---
  const gradeData = useMemo(() => 
    CURRICULUM_DATA.filter(item => item.grade === params.grade), 
  [params.grade]);

  const availableChapters = useMemo(() => 
    [...new Set(gradeData.map(item => item.parentTopic))], 
  [gradeData]);

  const availableSubTopics = useMemo(() => 
    gradeData.filter(item => item.parentTopic === newParentTopic),
  [gradeData, newParentTopic]);

  // --- HELPERS FOR CODE GENERATION ---
  const getGradePrefix = (gradeStr: string) => {
    const match = gradeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 9;
  };

  const generateCodesForSet = (gradePrefix: number, setIndex: number) => {
    // Logic: Set 1 (idx 0) -> x01, x02
    //        Set 2 (idx 1) -> x03, x04
    //        Set 3 (idx 2) -> x05, x06
    const start = gradePrefix * 100 + (setIndex * 2) + 1;
    const end = start + 1;
    return `${start}, ${end}`;
  };

  // --- EFFECTS ---
  
  // Reset fields AND Update Test Codes when Grade changes
  useEffect(() => {
    // 1. Reset input fields
    setNewParentTopic("");
    setNewTopicName("");
    setSelectedStandard(null);

    // 2. Update existing test sets with new codes based on grade
    setParams(prev => {
        const prefix = getGradePrefix(prev.grade);
        const updatedSets = prev.testSets.map((set, index) => ({
            ...set,
            specificCodes: generateCodesForSet(prefix, index)
        }));
        return { ...prev, testSets: updatedSets };
    });
  }, [params.grade]);

  // When Manual Input Name changes, try to fuzzy match for suggestions
  useEffect(() => {
    if (inputMode === 'select') return; // Don't run fuzzy search in select mode

    if (!newTopicName.trim()) {
        setSelectedStandard(null);
        return;
    }

    const lower = newTopicName.toLowerCase();
    // Check for exact match first
    const exactMatch = gradeData.find(item => item.topic.toLowerCase() === lower);
    if (exactMatch) {
        setSelectedStandard(exactMatch);
        if (!newParentTopic && exactMatch.parentTopic) {
            setNewParentTopic(exactMatch.parentTopic);
        }
    } else {
       setSelectedStandard(null);
    }
  }, [newTopicName, params.grade, inputMode, gradeData, newParentTopic]);

  const handleParentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setNewParentTopic(val);
      setNewTopicName(""); // Reset subtopic when parent changes
      setSelectedStandard(null);
  };

  const handleSubTopicSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setNewTopicName(val);
      const standard = availableSubTopics.find(t => t.topic === val);
      setSelectedStandard(standard || null);
  };

  const addSuggestionToDesc = (text: string) => {
      setNewTopicDescription(prev => {
          const prefix = prev.trim() ? "\n" : "";
          return prev + prefix + "- " + text;
      });
  };

  const safeParse = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // --- SCORE CALCULATOR ---
  const totalScore = useMemo(() => {
    let mcCount = 0, tfCount = 0, saCount = 0, esCount = 0;
    let scoreRec = 0, scoreComp = 0, scoreApp = 0; // Breakdown scores

    const sumL = (l: LevelCounts) => l.recognition + l.comprehension + l.application;
    const { multipleChoice: pMC, trueFalse: pTF, shortAnswer: pSA, essay: pES } = params.pointValues;
    
    params.topics.forEach(t => {
      // Counts
      mcCount += sumL(t.matrix.multipleChoice);
      tfCount += sumL(t.matrix.trueFalse);
      saCount += sumL(t.matrix.shortAnswer);
      esCount += sumL(t.matrix.essay);

      // Score Breakdown
      // Recognition (Biết)
      scoreRec += (t.matrix.multipleChoice.recognition * pMC) +
                  (t.matrix.trueFalse.recognition * pTF) +
                  (t.matrix.shortAnswer.recognition * pSA) +
                  (t.matrix.essay.recognition * pES);
      
      // Comprehension (Hiểu)
      scoreComp += (t.matrix.multipleChoice.comprehension * pMC) +
                   (t.matrix.trueFalse.comprehension * pTF) +
                   (t.matrix.shortAnswer.comprehension * pSA) +
                   (t.matrix.essay.comprehension * pES);

      // Application (Vận dụng)
      scoreApp += (t.matrix.multipleChoice.application * pMC) +
                  (t.matrix.trueFalse.application * pTF) +
                  (t.matrix.shortAnswer.application * pSA) +
                  (t.matrix.essay.application * pES);
    });

    const score = scoreRec + scoreComp + scoreApp;

    return { score, mcCount, tfCount, saCount, esCount, scoreRec, scoreComp, scoreApp };
  }, [params.topics, params.pointValues]);

  // --- SET LOGIC ---
  const handleSetCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(10, count));
    setParams(prev => {
        const currentSets = prev.testSets;
        const prefix = getGradePrefix(prev.grade);

        if (validCount > currentSets.length) {
            const newSets = [...currentSets];
            for (let i = currentSets.length; i < validCount; i++) {
                newSets.push({
                    id: Date.now() + i,
                    fileName: `Bo_De_So_${i + 1}`,
                    specificCodes: generateCodesForSet(prefix, i),
                    quantity: 2,
                    enableShuffle: true // Default to true here as well
                });
            }
            return { ...prev, testSets: newSets };
        } else if (validCount < currentSets.length) {
            return { ...prev, testSets: currentSets.slice(0, validCount) };
        }
        return prev;
    });
  };

  const updateSetParam = (index: number, field: keyof TestSetConfig, value: any) => {
      setParams(prev => {
          const newSets = [...prev.testSets];
          newSets[index] = { ...newSets[index], [field]: value };
          if (field === 'specificCodes') {
              newSets[index].quantity = (value as string).split(',').filter(s => s.trim()).length || 1;
          }
          return { ...prev, testSets: newSets };
      });
  };

  // --- MATRIX LOGIC ---
  const handleSaveTopic = () => {
    if (newTopicName.trim()) {
      const getVal = (r: number, c: number) => safeParse(matrixInput[r][c]);
      const newTopicData: Topic = {
        id: editingId || Date.now().toString(),
        name: newTopicName.trim(),
        parentName: newParentTopic.trim() || newTopicName.trim(), // Use name if parent not provided
        description: newTopicDescription.trim(),
        matrix: {
          multipleChoice: { recognition: getVal(0,0), comprehension: getVal(0,1), application: getVal(0,2) },
          trueFalse: { recognition: getVal(1,0), comprehension: getVal(1,1), application: getVal(1,2) },
          shortAnswer: { recognition: getVal(2,0), comprehension: getVal(2,1), application: getVal(2,2) },
          essay: { recognition: getVal(3,0), comprehension: getVal(3,1), application: getVal(3,2) },
        }
      };
      if (editingId) {
        setParams((prev) => ({ ...prev, topics: prev.topics.map(t => t.id === editingId ? newTopicData : t) }));
        setEditingId(null);
      } else {
        setParams((prev) => ({ ...prev, topics: [...prev.topics, newTopicData] }));
      }
      // Reset form but keep parent topic for faster entry of same chapter
      setNewTopicName("");
      // setNewParentTopic(""); // Optional: keep parent topic for workflow flow
      setNewTopicDescription("");
      setSelectedStandard(null);
      setMatrixInput(Array(4).fill(null).map(() => Array(3).fill("")));
    }
  };

  const handleEditTopic = (topic: Topic) => {
    // Switch to manual mode if the topic isn't in the dropdowns (legacy or custom)
    const exists = gradeData.some(i => i.topic === topic.name);
    setInputMode(exists ? 'select' : 'text');

    setNewTopicName(topic.name);
    setNewParentTopic(topic.parentName || "");
    setNewTopicDescription(topic.description || "");
    setEditingId(topic.id);
    const m = topic.matrix;
    setMatrixInput([
      [m.multipleChoice.recognition, m.multipleChoice.comprehension, m.multipleChoice.application].map(String),
      [m.trueFalse.recognition, m.trueFalse.comprehension, m.trueFalse.application].map(String),
      [m.shortAnswer.recognition, m.shortAnswer.comprehension, m.shortAnswer.application].map(String),
      [m.essay.recognition, m.essay.comprehension, m.essay.application].map(String),
    ]);
    
    // Attempt to match standard for editing
    const standard = gradeData.find(t => t.topic === topic.name);
    setSelectedStandard(standard || null);
    
    // Ensure we are in manual tab to edit
    setMatrixTab("manual");
  };

  // --- FILE HANDLING ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyzeFile = async () => {
      if (!selectedFile) return;
      if (!apiKey) {
          alert("Vui lòng nhập API Key để sử dụng tính năng phân tích file.");
          return;
      }

      setIsAnalyzingFile(true);
      try {
          // 1. Extract text
          const text = await extractTextFromFile(selectedFile);
          
          // 2. Parse using Gemini
          const { topics: parsedTopics, detectedGrade } = await parseMatrixFromText(text, apiKey);
          
          if (parsedTopics && Array.isArray(parsedTopics) && parsedTopics.length > 0) {
              setParams(prev => {
                  const newState = {
                      ...prev,
                      topics: parsedTopics,
                      matrixFileContent: undefined
                  };
                  // Auto-update grade if detected and valid
                  if (detectedGrade && GRADES.includes(detectedGrade)) {
                      newState.grade = detectedGrade;
                  }
                  return newState;
              });
              
              setMatrixTab("manual"); 
              setSelectedFile(null);
              
              let msg = `Đã trích xuất thành công ${parsedTopics.length} chủ đề!`;
              if (detectedGrade && GRADES.includes(detectedGrade)) {
                  msg += `\nĐã tự động chọn Khối lớp: ${detectedGrade}`;
              }
              alert(msg);
          } else {
              alert("Không tìm thấy dữ liệu ma trận hợp lệ trong file.");
          }
      } catch (err: any) {
          console.error(err);
          alert(`Lỗi phân tích file: ${err.message}`);
      } finally {
          setIsAnalyzingFile(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  const renderMatrixRow = (label: string, rowIdx: number, pointKey: keyof typeof params.pointValues) => {
    // Helper to identify if a level is suggested in the selected standard
    const getLevelClass = (colIndex: number) => {
        if (!selectedStandard) return "bg-white border-slate-200";
        
        // 0: NB, 1: TH, 2: VD
        let hasContent = false;
        if (colIndex === 0 && selectedStandard.content.nb.length > 0) hasContent = true;
        if (colIndex === 1 && selectedStandard.content.th.length > 0) hasContent = true;
        if (colIndex === 2 && selectedStandard.content.vd.length > 0) hasContent = true;

        return hasContent 
            ? "bg-yellow-100 border-yellow-400 font-semibold text-yellow-900 shadow-sm" 
            : "bg-white border-slate-200";
    };

    return (
        <div className="grid grid-cols-6 gap-2 items-center mb-2">
        <div className="col-span-2">
            <div className="text-xs font-bold text-slate-700">{label}</div>
        </div>
        <div className="col-span-1 relative">
            <input 
                type="number" step="0.05" min="0"
                value={params.pointValues[pointKey]}
                onChange={(e) => setParams(p => ({...p, pointValues: {...p.pointValues, [pointKey]: parseFloat(e.target.value)||0}}))}
                className="w-full text-center text-xs font-bold bg-yellow-50 border border-yellow-200 rounded p-1 pl-3" 
            />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-slate-400">/câu</span>
        </div>
        {[0, 1, 2].map(col => (
            <input 
                key={col} type="number" min="0" 
                value={matrixInput[rowIdx][col]} 
                onChange={(e) => {
                    const newG = [...matrixInput]; newG[rowIdx] = [...newG[rowIdx]]; newG[rowIdx][col] = e.target.value;
                    setMatrixInput(newG);
                }}
                className={`col-span-1 w-full text-center text-xs rounded p-1 focus:ring-1 focus:ring-blue-500 border ${getLevelClass(col)} transition-colors`} 
                placeholder="0"
            />
        ))}
        </div>
    );
  };

  return (
    <div className="w-full space-y-6 pb-28">
      
      {/* 1. API KEY & GENERAL CONFIG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
              {/* API Key */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1"><Key className="w-3 h-3" /> API KEY</label>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">Lấy key</a>
                  </div>
                  <div>
                      <input 
                        type="password" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                        placeholder="Nhập API Key (được ẩn)" 
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-100" 
                      />
                  </div>
              </div>
              
              {/* Grade & Duration */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 gap-3">
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Khối lớp</label>
                      <select value={params.grade} onChange={(e) => setParams(p => ({...p, grade: e.target.value}))} className="w-full text-sm border-slate-200 rounded-md bg-slate-50">
                          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thời gian</label>
                      <select value={params.duration} onChange={(e) => setParams(p => ({...p, duration: e.target.value}))} className="w-full text-sm border-slate-200 rounded-md bg-slate-50">
                          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                  </div>
              </div>
          </div>

          {/* Sets Configuration */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><Files className="w-4 h-4" /> Cấu hình Bộ đề</h3>
                  <select 
                    value={params.testSets.length}
                    onChange={(e) => handleSetCountChange(parseInt(e.target.value))}
                    className="px-2 py-1 bg-white border border-indigo-200 rounded text-xs font-bold text-indigo-700"
                  >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Bộ</option>)}
                  </select>
              </div>

              <div className="space-y-3 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                  {params.testSets.map((set, idx) => (
                      <div key={set.id} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm relative group">
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">{idx + 1}</div>
                          <div className="mt-1 space-y-2">
                              <div className="flex gap-2">
                                  <div className="flex-1">
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Mã đề (VD: {generateCodesForSet(getGradePrefix(params.grade), idx)})</label>
                                      <input 
                                          type="text" 
                                          value={set.specificCodes} 
                                          onChange={(e) => updateSetParam(idx, 'specificCodes', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm font-medium focus:ring-1 focus:ring-indigo-300"
                                          placeholder="Nhập các mã đề..."
                                      />
                                  </div>
                                  <div className="w-16">
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Số lượng</label>
                                      <div className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm text-center text-slate-500">
                                          {set.quantity}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 select-none">
                                      <input type="checkbox" checked={set.enableShuffle} onChange={(e) => updateSetParam(idx, 'enableShuffle', e.target.checked)} className="accent-indigo-600" />
                                      <Shuffle className="w-3 h-3" /> Trộn (trừ Tự Luận)
                                  </label>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              
              {params.testSets.length > 1 && (
                  <div className="mt-3 bg-white p-2 rounded border border-indigo-100 flex items-center gap-2">
                      <input 
                          type="checkbox" 
                          checked={params.preventDuplicates}
                          onChange={(e) => setParams(p => ({...p, preventDuplicates: e.target.checked}))}
                          className="accent-indigo-600 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
                          <CopyX className="w-3 h-3" /> Không trùng câu hỏi giữa các bộ
                      </span>
                  </div>
              )}
          </div>
      </div>

      {/* 2. MATRIX SETTINGS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100">
              <button 
                  onClick={() => setMatrixTab("manual")} 
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${matrixTab === "manual" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-slate-500 hover:bg-slate-50"}`}
              >
                  <Grid3X3 className="w-4 h-4" /> Ma trận Thủ công
              </button>
              <button 
                  onClick={() => setMatrixTab("file")} 
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${matrixTab === "file" ? "text-green-600 border-b-2 border-green-600 bg-green-50" : "text-slate-500 hover:bg-slate-50"}`}
              >
                  <Wand2 className="w-4 h-4" /> Nhập từ File AI
              </button>
          </div>

          <div className="p-4 lg:p-6">
              {matrixTab === "file" ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                      {isAnalyzingFile ? (
                          <div className="flex flex-col items-center text-green-600 animate-pulse">
                              <Loader2 className="w-10 h-10 animate-spin mb-2" />
                              <span className="font-bold">Đang đọc & phân tích file...</span>
                              <span className="text-xs text-slate-400">Vui lòng chờ AI trích xuất dữ liệu</span>
                          </div>
                      ) : !selectedFile ? (
                          <div className="w-full max-w-md animate-in fade-in zoom-in-95">
                              <input 
                                  type="file" accept=".docx,.pdf" 
                                  ref={fileInputRef} 
                                  onChange={handleFileSelect}
                                  className="hidden" id="file-upload" 
                              />
                              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group">
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                      <Upload className="w-6 h-6 text-green-600" />
                                  </div>
                                  <span className="text-sm font-bold text-slate-700">Tải lên Ma trận (.docx / .pdf)</span>
                                  <span className="text-xs text-slate-500 mt-1">AI sẽ tự động đọc và điền vào danh sách</span>
                              </label>
                              <div className="text-xs text-slate-400 mt-4">
                                  <p>Mẹo: Upload file chứa bảng ma trận. AI sẽ cố gắng nhận diện cột Chủ đề, và số lượng câu hỏi (TN, Đ/S, TLN, TL) để điền vào form bên cạnh.</p>
                              </div>
                          </div>
                      ) : (
                          <div className="w-full max-w-md bg-white border-2 border-green-100 rounded-xl p-6 shadow-sm text-center animate-in fade-in zoom-in-95">
                              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CheckCircle className="w-8 h-8" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-800 mb-1">Tải file thành công!</h3>
                              <p className="text-sm text-slate-500 mb-6 flex items-center justify-center gap-2 bg-slate-50 py-2 rounded border border-slate-100">
                                  <FileText className="w-4 h-4" />
                                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                              </p>
                              
                              <div className="flex gap-3">
                                  <button 
                                      onClick={() => {setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value='';}}
                                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                      Hủy bỏ
                                  </button>
                                  <button 
                                      onClick={handleAnalyzeFile}
                                      className="flex-[2] py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                  >
                                      <Wand2 className="w-4 h-4" /> Phân tích ngay
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                      {/* INPUT SECTION - Expanded to 9 columns on extra large screens (Was 8) */}
                      <div className="xl:col-span-9 lg:col-span-7 space-y-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-slate-700">{editingId ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}</h4>
                                <button 
                                  onClick={() => {
                                    setInputMode(prev => prev === 'select' ? 'text' : 'select');
                                    setNewParentTopic("");
                                    setNewTopicName("");
                                    setSelectedStandard(null);
                                  }}
                                  className="text-[10px] flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100"
                                >
                                  {inputMode === 'select' ? <><PenLine className="w-3 h-3"/> Nhập thủ công</> : <><List className="w-3 h-3"/> Chọn danh sách</>}
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-3 mb-3">
                                  {/* Parent Topic Input */}
                                  <div>
                                      <label className="block text-[10px] text-slate-500 font-bold mb-1">Chủ đề lớn (Chương)</label>
                                      {inputMode === 'select' ? (
                                        <select 
                                          value={newParentTopic} 
                                          onChange={handleParentSelect} 
                                          className="w-full text-xs border-slate-300 rounded-md bg-white py-1.5 focus:ring-2 focus:ring-blue-200"
                                        >
                                          <option value="">-- Chọn Chương/Chủ đề lớn --</option>
                                          {availableChapters.map(chap => (
                                            <option key={chap} value={chap}>{chap}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input 
                                            type="text" 
                                            value={newParentTopic} 
                                            onChange={(e) => setNewParentTopic(e.target.value)}
                                            placeholder="VD: Số tự nhiên"
                                            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-200"
                                        />
                                      )}
                                  </div>

                                  {/* Sub Topic Input */}
                                  <div>
                                      <label className="block text-[10px] text-slate-500 font-bold mb-1">Chủ đề nhỏ (Nội dung)</label>
                                      {inputMode === 'select' ? (
                                        <select 
                                          value={newTopicName} 
                                          onChange={handleSubTopicSelect}
                                          disabled={!newParentTopic}
                                          className="w-full text-xs border-slate-300 rounded-md bg-white py-1.5 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100 disabled:text-slate-400"
                                        >
                                          <option value="">-- Chọn Nội dung --</option>
                                          {availableSubTopics.map(t => (
                                            <option key={t.topic} value={t.topic}>{t.topic}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <div className="relative">
                                          <input 
                                              type="text" 
                                              value={newTopicName} 
                                              onChange={(e) => setNewTopicName(e.target.value)}
                                              placeholder="Nhập tên nội dung..."
                                              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-200"
                                          />
                                          {newTopicName && <button onClick={() => setNewTopicName("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3 h-3"/></button>}
                                        </div>
                                      )}
                                  </div>
                              </div>

                              {/* SELECTED STANDARD SUGGESTIONS (Triggered by dropdown) */}
                              {selectedStandard && (
                                <div className="mb-3 bg-blue-50 border border-blue-100 rounded-lg p-2.5 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between gap-1.5 text-xs font-semibold text-blue-800 mb-2">
                                        <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3 text-yellow-500" /> Gợi ý nội dung:</span>
                                        <button onClick={() => setSelectedStandard(null)} className="text-[10px] text-slate-400 hover:text-slate-600">Ẩn</button>
                                    </div>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                                        {selectedStandard.content.nb.length > 0 && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Biết:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedStandard.content.nb.map((item, i) => (
                                                        <button key={i} onClick={() => addSuggestionToDesc(item)} className="px-2 py-1 bg-white border border-blue-200 rounded text-[10px] text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors text-left max-w-full">
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedStandard.content.th.length > 0 && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Hiểu:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedStandard.content.th.map((item, i) => (
                                                        <button key={i} onClick={() => addSuggestionToDesc(item)} className="px-2 py-1 bg-white border border-green-200 rounded text-[10px] text-slate-600 hover:bg-green-100 hover:text-green-700 transition-colors text-left max-w-full">
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedStandard.content.vd.length > 0 && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Vận dụng:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedStandard.content.vd.map((item, i) => (
                                                        <button key={i} onClick={() => addSuggestionToDesc(item)} className="px-2 py-1 bg-white border border-orange-200 rounded text-[10px] text-slate-600 hover:bg-orange-100 hover:text-orange-700 transition-colors text-left max-w-full">
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                              )}

                              <div className="mb-4 relative">
                                  <textarea 
                                    value={newTopicDescription}
                                    onChange={(e) => setNewTopicDescription(e.target.value)}
                                    placeholder="Gợi ý chi tiết (Tùy chọn). Chọn từ gợi ý trên hoặc tự nhập..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-blue-200 h-20 resize-none"
                                  />
                                  <div className="absolute right-2 bottom-2 text-[10px] text-slate-400 pointer-events-none">
                                      <BookOpen className="w-3 h-3 inline mr-1" />
                                      {newTopicDescription.length} chars
                                  </div>
                              </div>

                              <div className="grid grid-cols-6 gap-2 mb-2 text-[10px] font-bold uppercase text-slate-400 text-center">
                                  <div className="col-span-2 text-left pl-2">Loại câu hỏi</div>
                                  <div className="col-span-1">Điểm/Câu</div>
                                  <div>Biết</div>
                                  <div>Hiểu</div>
                                  <div>Vận dụng</div>
                              </div>

                              <div className="space-y-1">
                                  {renderMatrixRow("Trắc nghiệm", 0, "multipleChoice")}
                                  {renderMatrixRow("Đúng / Sai", 1, "trueFalse")}
                                  {renderMatrixRow("Trả lời ngắn", 2, "shortAnswer")}
                                  {renderMatrixRow("Tự luận", 3, "essay")}
                              </div>

                              <div className="mt-4 flex gap-2 justify-end">
                                  {editingId && <button onClick={() => {setEditingId(null); setNewTopicName(""); setNewParentTopic(""); setNewTopicDescription("");}} className="px-4 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600">Hủy</button>}
                                  <button onClick={handleSaveTopic} disabled={!newTopicName} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 flex items-center gap-1">
                                      {editingId ? "Lưu thay đổi" : <><Plus className="w-3 h-3" /> Thêm vào danh sách</>}
                                  </button>
                              </div>
                          </div>

                          {/* CALCULATOR */}
                          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-900 shadow-sm">
                              <h4 className="text-xs font-bold uppercase mb-3 flex items-center gap-2 border-b border-yellow-200 pb-2"><Calculator className="w-4 h-4" /> Tổng điểm dự kiến</h4>
                              
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="text-xs space-y-1.5">
                                      <div className="flex justify-between"><span>Số câu TN:</span> <b>{totalScore.mcCount}</b></div>
                                      <div className="flex justify-between"><span>Số câu Đ/S:</span> <b>{totalScore.tfCount}</b></div>
                                      <div className="flex justify-between"><span>Số câu TLN:</span> <b>{totalScore.saCount}</b></div>
                                      <div className="flex justify-between"><span>Số câu TL:</span> <b>{totalScore.esCount}</b></div>
                                  </div>
                                  <div className="text-right flex flex-col justify-end">
                                      <div className="text-4xl font-bold text-yellow-600 leading-none">{totalScore.score.toFixed(2)}</div>
                                      <div className="text-[10px] font-medium opacity-75 mt-1">trên thang điểm 10</div>
                                  </div>
                              </div>

                              {/* Breakdown by Cognitive Level */}
                              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-yellow-200">
                                  <div className="bg-white/50 rounded p-1.5">
                                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Biết</div>
                                      <div className="text-sm font-bold text-yellow-700">{totalScore.scoreRec.toFixed(2)}đ</div>
                                  </div>
                                  <div className="bg-white/50 rounded p-1.5">
                                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Hiểu</div>
                                      <div className="text-sm font-bold text-yellow-700">{totalScore.scoreComp.toFixed(2)}đ</div>
                                  </div>
                                  <div className="bg-white/50 rounded p-1.5">
                                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Vận dụng</div>
                                      <div className="text-sm font-bold text-yellow-700">{totalScore.scoreApp.toFixed(2)}đ</div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* LIST SECTION - Condensed to 3 columns on extra large screens (Was 4) */}
                      <div className="xl:col-span-3 lg:col-span-5">
                          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><ListChecks className="w-4 h-4" /> Danh sách Chủ đề đã thêm</h4>
                          <div className="space-y-2 max-h-[400px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                              {params.topics.length === 0 ? (
                                  <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                      Chưa có chủ đề nào. Hãy nhập thông tin và nhấn "Thêm vào danh sách".
                                  </div>
                              ) : (
                                  params.topics.map((t, idx) => (
                                      <div key={t.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-2 shadow-sm hover:border-blue-300 transition-colors">
                                          <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{idx + 1}</div>
                                                  <div>
                                                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                          <FolderTree className="w-3 h-3"/> {t.parentName || "Chương ..."}
                                                      </div>
                                                      <div className="font-bold text-sm text-slate-800 line-clamp-2">{t.name}</div>
                                                  </div>
                                              </div>
                                              <div className="flex gap-1">
                                                  <button onClick={() => handleEditTopic(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Settings2 className="w-4 h-4" /></button>
                                                  <button onClick={() => setParams(p => ({...p, topics: p.topics.filter(x => x.id !== t.id)}))} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          </div>
                                          
                                          {t.description && (
                                            <div className="ml-9 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 flex gap-2">
                                                <MessageSquareText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span className="italic line-clamp-2">{t.description}</span>
                                            </div>
                                          )}

                                          <div className="ml-9 text-[10px] text-slate-500 flex flex-wrap gap-2">
                                              <span className="bg-slate-100 px-1.5 py-0.5 rounded"><b>TN:</b> {t.matrix.multipleChoice.recognition + t.matrix.multipleChoice.comprehension + t.matrix.multipleChoice.application}</span>
                                              <span className="bg-slate-100 px-1.5 py-0.5 rounded"><b>ĐS:</b> {t.matrix.trueFalse.recognition + t.matrix.trueFalse.comprehension + t.matrix.trueFalse.application}</span>
                                              <span className="bg-slate-100 px-1.5 py-0.5 rounded"><b>TLN:</b> {t.matrix.shortAnswer.recognition + t.matrix.shortAnswer.comprehension + t.matrix.shortAnswer.application}</span>
                                              <span className="bg-slate-100 px-1.5 py-0.5 rounded"><b>TL:</b> {t.matrix.essay.recognition + t.matrix.essay.comprehension + t.matrix.essay.application}</span>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* 3. GENERATE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg z-30 flex justify-center">
         <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <button 
                onClick={onGenerate} 
                disabled={isLoading} 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed transform transition-all active:scale-[0.99]"
            >
                {isLoading ? <span className="animate-pulse">Đang xử lý yêu cầu...</span> : "TẠO ĐỀ THI NGAY"}
            </button>
         </div>
      </div>

    </div>
  );
};

export default InputForm;