
import React, { useState, useRef } from "react";
import { generateTikZCode, analyzeTikZStyle } from "../services/geminiService";
import { PenTool, Copy, Check, Code, ArrowRight, PlayCircle, Loader2, Key, ExternalLink, Download, Image as ImageIcon, Sparkles, X, Wand2 } from "lucide-react";

interface TikZGeneratorProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const TikZGenerator: React.FC<TikZGeneratorProps> = ({ apiKey, setApiKey }) => {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  
  // New State for Image Learning
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [learnedStyle, setLearnedStyle] = useState<string>("");
  const [isLearning, setIsLearning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [styleLearnedFromCode, setStyleLearnedFromCode] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Reset learned style when new image is uploaded
      setLearnedStyle(""); 
      setStyleLearnedFromCode(false);
    }
  };

  const handleLearnStyleFromImage = async () => {
      if (!apiKey) {
          alert("Vui lòng nhập API Key.");
          return;
      }
      if (!selectedImage) return;

      setIsLearning(true);
      try {
          const style = await analyzeTikZStyle(selectedImage, apiKey);
          setLearnedStyle(style);
          setStyleLearnedFromCode(false);
      } catch (e) {
          alert("Lỗi khi phân tích hình ảnh.");
      } finally {
          setIsLearning(false);
      }
  };

  const handleLearnStyleFromCurrentCode = () => {
      if (!code) return;
      // Simple heuristic: Take the current code as the "style example"
      const styleSummary = `Hãy tham khảo cách vẽ của đoạn code sau đây (về màu sắc, nét vẽ, kích thước điểm) cho các hình tiếp theo:\n\n${code}`;
      setLearnedStyle(styleSummary);
      setStyleLearnedFromCode(true);
      alert("Đã học phong cách từ mã hiện tại! Các hình tiếp theo sẽ cố gắng tuân theo phong cách này.");
  };

  const removeImage = () => {
      setSelectedImage(null);
      setImagePreview(null);
      setLearnedStyle("");
      setStyleLearnedFromCode(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerateCode = async () => {
    if (!apiKey) {
        alert("Vui lòng nhập API Key.");
        return;
    }
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      // Direct generation with style context
      const res = await generateTikZCode(prompt, apiKey, learnedStyle);
      setCode(res);
    } catch (e) {
      alert("Lỗi khi tạo mã TikZ.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFullLatexDocument = (tikzCode: string) => {
    return `\\documentclass[tikz,border=5mm]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tkz-euclide}
\\usetikzlibrary{calc,angles,quotes,intersections,through,backgrounds,patterns}
\\begin{document}
${tikzCode}
\\end{document}`;
  };

  const handleDownloadTex = () => {
    if (!code) return;
    const fullDoc = getFullLatexDocument(code);
    const blob = new Blob([fullDoc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hinh_ve_tikz.tex";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenOverleaf = () => {
    if (!code) return;
    
    // Create a temporary form to POST data to Overleaf's Docs API
    const form = document.createElement("form");
    form.action = "https://www.overleaf.com/docs";
    form.method = "POST";
    form.target = "_blank";
    
    // Complete standalone document wrapper
    const fullDoc = getFullLatexDocument(code);

    const input = document.createElement("textarea");
    input.name = "snip";
    input.value = fullDoc;
    input.style.display = "none";
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  if (!apiKey) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
           <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6"/> 
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Yêu cầu API Key</h3>
              <p className="text-sm text-slate-500 mb-4">Vui lòng nhập Google Gemini API Key để sử dụng tính năng vẽ hình thông minh.</p>
              <input
                type="password"
                placeholder="Dán API Key vào đây..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="text-xs text-slate-400">Key của bạn được lưu cục bộ trên trình duyệt.</div>
           </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-20">
       {/* LEFT COLUMN: Input & Image Learning */}
       <div className="flex flex-col gap-4 h-full">
           
           {/* SECTION: IMAGE LEARNING */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                   <ImageIcon className="w-4 h-4 text-pink-600" /> Học phong cách từ ảnh (Optional)
               </h3>
               
               {!imagePreview ? (
                   <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors h-24">
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                       <Sparkles className="w-6 h-6 mb-1 text-slate-300" />
                       <span className="text-xs">Tải ảnh mẫu (đề thi cũ) để AI học lệnh</span>
                   </div>
               ) : (
                   <div className="flex gap-4 items-start">
                       <div className="relative w-24 h-24 flex-shrink-0 border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                           <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                           <button onClick={removeImage} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"><X className="w-3 h-3"/></button>
                       </div>
                       
                       <div className="flex-1 space-y-2">
                           {learnedStyle && !styleLearnedFromCode ? (
                               <div className="text-xs bg-green-50 border border-green-200 text-green-700 p-2 rounded">
                                   <div className="font-bold flex items-center gap-1 mb-1"><Check className="w-3 h-3"/> Đã học phong cách!</div>
                                   <p className="line-clamp-2 opacity-80 text-[10px]">{learnedStyle}</p>
                                   <button onClick={() => setLearnedStyle("")} className="text-[10px] underline mt-1 text-green-600">Học lại</button>
                               </div>
                           ) : (
                               <button 
                                   onClick={handleLearnStyleFromImage}
                                   disabled={isLearning}
                                   className="w-full py-2 bg-pink-50 text-pink-700 border border-pink-200 rounded-lg text-xs font-bold hover:bg-pink-100 flex items-center justify-center gap-2"
                               >
                                   {isLearning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                   Phân tích & Lưu Style
                               </button>
                           )}
                       </div>
                   </div>
               )}
               
               {/* Display if style is learned from previous code generation */}
               {learnedStyle && styleLearnedFromCode && (
                   <div className="mt-2 text-xs bg-purple-50 border border-purple-200 text-purple-700 p-2 rounded flex justify-between items-center">
                       <span className="flex items-center gap-1"><Wand2 className="w-3 h-3"/> Đang áp dụng phong cách từ mã trước đó</span>
                       <button onClick={() => {setLearnedStyle(""); setStyleLearnedFromCode(false);}} className="text-[10px] underline text-purple-600 hover:text-purple-800">Xóa</button>
                   </div>
               )}
           </div>

           {/* SECTION: TEXT INPUT */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                 <PenTool className="w-5 h-5 text-blue-600" /> Mô tả hình học
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                  Nhập mô tả bài toán hình học. Hệ thống sẽ tự động sử dụng phong cách "Chân trời sáng tạo" (nét đậm vừa, màu xanh/cam nhạt).
              </p>
              <textarea 
                 className="w-full p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm flex-1 min-h-[150px] font-mono leading-relaxed"
                 placeholder="Ví dụ: Cho tam giác ABC vuông tại A, đường cao AH. Gọi M là trung điểm của BC..."
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
              />
              <button 
                 onClick={handleGenerateCode} 
                 disabled={isGenerating || !prompt}
                 className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                 {isGenerating ? <Loader2 className="w-5 h-5 animate-spin"/> : <PlayCircle className="w-5 h-5" />}
                 Tạo mã TikZ Ngay
              </button>
           </div>
       </div>

       {/* RIGHT COLUMN: Code Output */}
       <div className="bg-slate-900 p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-800">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
             <h3 className="font-bold text-slate-200 flex items-center gap-2"><Code className="w-5 h-5" /> Mã LaTeX / TikZ</h3>
             
             {code && (
                <div className="flex gap-2 flex-wrap justify-end">
                    {/* Learn Button */}
                    <button 
                        onClick={handleLearnStyleFromCurrentCode} 
                        title="Dùng style này cho hình tiếp theo"
                        className="text-xs bg-purple-700 hover:bg-purple-600 text-white font-bold flex items-center gap-1 px-3 py-1.5 rounded transition-colors shadow-sm"
                    >
                       <Wand2 className="w-3 h-3" /> Học Style này
                    </button>

                    <button onClick={handleOpenOverleaf} className="text-xs bg-green-700 hover:bg-green-600 text-white font-bold flex items-center gap-1 px-3 py-1.5 rounded transition-colors shadow-sm">
                       <ExternalLink className="w-3 h-3" /> Overleaf
                    </button>
                    <button onClick={handleDownloadTex} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1 px-3 py-1.5 rounded transition-colors border border-slate-600">
                       <Download className="w-3 h-3" /> .tex
                    </button>
                    <button onClick={copyToClipboard} className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded transition-colors border border-slate-700">
                       {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />} Copy
                    </button>
                </div>
             )}
          </div>
          <div className="flex-1 bg-slate-950 rounded-lg p-4 font-mono text-xs text-green-400 overflow-auto custom-scrollbar border border-slate-800 relative">
             {isGenerating ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                     <Loader2 className="w-8 h-8 animate-spin mb-2" />
                     <span className="text-xs">Đang vẽ hình theo phong cách Chân trời sáng tạo...</span>
                 </div>
             ) : code ? (
                 <pre>{code}</pre> 
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 opacity-50">
                     <ArrowRight className="w-8 h-8" />
                     <span>Nhập mô tả và nhấn tạo để xem code</span>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default TikZGenerator;
