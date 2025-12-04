
import React, { useState, useRef, useMemo, useEffect } from "react";
import { TestParams, Topic, TestSetConfig, LevelCounts } from "../types";
import { GRADES, DURATIONS } from "../constants";
import { CURRICULUM_DATA, CurriculumStandard } from "../data/curriculumData";
import { 
  Key, Eye, EyeOff, Files, Settings2, Trash2, Upload, FileText, Grid3X3, FileInput, Shuffle, CopyX, Plus, ListChecks, Calculator, MessageSquareText, Lightbulb, BookOpen, ChevronRight, X, FolderTree, PenLine, List
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
  const [showApiKey, setShowApiKey] = useState(false);
  const [matrixTab, setMatrixTab] = useState<"manual" | "file">("manual");
  const [inputMode, setInputMode] = useState<"select" | "text">("select"); // Toggle between Dropdown and Manual Text
  
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

  // --- EFFECTS ---
  
  // Reset fields when Grade changes
  useEffect(() => {
    setNewParentTopic("");
    setNewTopicName("");
    setSelectedStandard(null);
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
    const validCount = Math.max(1, Math.min(5, count));
    setParams(prev => {
        const currentSets = prev.testSets;
        if (validCount > currentSets.length) {
            const newSets = [...currentSets];
            for (let i = currentSets.length; i < validCount; i++) {
                newSets.push({
                    id: i + 1,
                    fileName: `Bo_De_So_${i + 1}`,
                    specificCodes: `${(i + 1) * 100 + 1}, ${(i + 1) * 100 + 2}`,
                    quantity: 2,
                    enableShuffle: false
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
  };

  const renderMatrixRow = (label: string, rowIdx: number, pointKey: keyof typeof params.pointValues) => (
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
               className="col-span-1 w-full text-center text-xs border border-slate-200 rounded p-1 focus:ring-1 focus:ring-blue-500" 
               placeholder="0"
           />
       ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* 1. API KEY & GENERAL CONFIG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
              {/* API Key */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1"><Key className="w-3 h-3" /> API KEY</label>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">Lấy key</a>
                  </div>
                  <div className="relative">
                      <input type={showApiKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Nhập API Key..." className="w-full px-3 py-1.5 pr-8 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-100" />
                      <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Mã đề (VD: 601, 602)</label>
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
                  <FileInput className="w-4 h-4" /> Nhập từ File (Docx/PDF)
              </button>
          </div>

          <div className="p-6">
              {matrixTab === "file" ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                      {params.matrixFileContent ? (
                          <div className="p-6 bg-green-50 rounded-xl border border-green-200 max-w-md w-full">
                              <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
                              <div className="font-bold text-green-800">Đã tải file thành công</div>
                              <button onClick={() => setParams(p => ({...p, matrixFileContent: undefined}))} className="mt-4 text-xs text-red-500 hover:underline">Xóa file</button>
                          </div>
                      ) : (
                          <div className="w-full max-w-md">
                              <input 
                                  type="file" accept=".docx,.pdf" 
                                  ref={fileInputRef} 
                                  onChange={async (e) => {
                                      if(e.target.files?.[0]) {
                                          setParams(p => ({...p, matrixFileContent: "File uploaded successfully."}));
                                      }
                                  }} 
                                  className="hidden" id="file-upload" 
                              />
                              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                                  <span className="text-sm font-medium text-slate-600">Tải lên file Word (.docx) hoặc PDF</span>
                              </label>
                          </div>
                      )}
                  </div>
              ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* INPUT SECTION */}
                      <div className="lg:col-span-5 space-y-4">
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

                      {/* LIST SECTION */}
                      <div className="lg:col-span-7">
                          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><ListChecks className="w-4 h-4" /> Danh sách Chủ đề đã thêm</h4>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
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
                                                      <div className="font-bold text-sm text-slate-800">{t.name}</div>
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
                                                <span className="italic">{t.description}</span>
                                            </div>
                                          )}

                                          <div className="ml-9 text-[10px] text-slate-500 flex gap-3">
                                              <span><b>TN:</b> {t.matrix.multipleChoice.recognition + t.matrix.multipleChoice.comprehension + t.matrix.multipleChoice.application}</span>
                                              <span><b>ĐS:</b> {t.matrix.trueFalse.recognition + t.matrix.trueFalse.comprehension + t.matrix.trueFalse.application}</span>
                                              <span><b>TLN:</b> {t.matrix.shortAnswer.recognition + t.matrix.shortAnswer.comprehension + t.matrix.shortAnswer.application}</span>
                                              <span><b>TL:</b> {t.matrix.essay.recognition + t.matrix.essay.comprehension + t.matrix.essay.application}</span>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-30 flex justify-center">
         <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
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
