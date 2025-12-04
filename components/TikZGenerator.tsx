
import React, { useState } from "react";
import { generateTikZCode, generateGeometryPlan } from "../services/geminiService";
import { PenTool, Copy, Check, Code, ArrowRight, RotateCcw, PlayCircle, Loader2, Key, ExternalLink, Download, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface TikZGeneratorProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const TikZGenerator: React.FC<TikZGeneratorProps> = ({ apiKey, setApiKey }) => {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState(""); // The step-by-step plan
  const [code, setCode] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!apiKey) {
        alert("Vui lòng nhập API Key trước khi phân tích.");
        return;
    }
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    setPlan("");
    setCode("");
    try {
      const result = await generateGeometryPlan(prompt, apiKey);
      setPlan(result);
    } catch (e) {
      alert("Lỗi khi phân tích hình vẽ. Vui lòng kiểm tra API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!apiKey) {
        alert("Vui lòng nhập API Key.");
        return;
    }
    if (!prompt.trim() || !plan.trim()) return;
    setIsGenerating(true);
    try {
      const res = await generateTikZCode(prompt, plan, apiKey);
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

  const handleDownloadTex = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
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
    // This allows opening the code directly in a new Overleaf project for compilation/preview
    const form = document.createElement("form");
    form.action = "https://www.overleaf.com/docs";
    form.method = "POST";
    form.target = "_blank";

    const input = document.createElement("textarea");
    input.name = "snip";
    input.value = code;
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
       {/* LEFT COLUMN: Input & Plan */}
       <div className="flex flex-col gap-4 h-full">
           {/* Input Section */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col transition-all flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                 <PenTool className="w-5 h-5 text-purple-600" /> Mô tả hình học
              </h3>
              <textarea 
                 className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm min-h-[80px]"
                 placeholder="Ví dụ: Vẽ tam giác ABC vuông tại A, đường cao AH. Kẻ trung tuyến AM..."
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
              />
              <button 
                 onClick={handleAnalyze} 
                 disabled={isAnalyzing || !prompt}
                 className="mt-3 w-full py-2.5 bg-purple-100 text-purple-700 font-bold rounded-lg hover:bg-purple-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                 {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : <RotateCcw className="w-4 h-4" />}
                 {plan ? "Phân tích lại mô tả" : "Phân tích các bước vẽ"}
              </button>
           </div>

           {/* Plan Section (Appears after analysis) */}
           {plan && (
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-1 flex flex-col overflow-hidden animate-in slide-in-from-top-2">
                   <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Edit3 className="w-4 h-4" /> Kế hoạch vẽ
                        </h4>
                        <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Có thể chỉnh sửa</span>
                   </div>
                   
                   <div className="flex-1 relative mb-3">
                        <textarea
                            className="w-full h-full p-3 border border-blue-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white shadow-inner custom-scrollbar leading-relaxed font-mono"
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                            placeholder="Các bước vẽ sẽ hiện ra ở đây..."
                        />
                   </div>
                   
                   <div className="text-[10px] text-slate-500 italic mb-2 px-1">
                       * Bạn có thể sửa trực tiếp các bước ở trên (thêm điểm, đổi tọa độ...) trước khi tạo mã.
                   </div>
                   
                   <button 
                       onClick={handleGenerateCode}
                       disabled={isGenerating}
                       className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 flex-shrink-0"
                   >
                       {isGenerating ? <Loader2 className="w-5 h-5 animate-spin"/> : <PlayCircle className="w-5 h-5" />}
                       Đồng ý & Tạo mã TikZ
                   </button>
               </div>
           )}
       </div>

       {/* RIGHT COLUMN: Code Output */}
       <div className="bg-slate-900 p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-800">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
             <h3 className="font-bold text-slate-200 flex items-center gap-2"><Code className="w-5 h-5" /> Mã LaTeX / TikZ</h3>
             
             {code && (
                <div className="flex gap-2">
                    <button onClick={handleOpenOverleaf} className="text-xs bg-green-700 hover:bg-green-600 text-white font-bold flex items-center gap-1 px-3 py-1.5 rounded transition-colors shadow-sm">
                       <ExternalLink className="w-3 h-3" /> Xem PDF (Overleaf)
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
                     <span className="text-xs">Đang viết mã...</span>
                 </div>
             ) : code ? (
                 <pre>{code}</pre> 
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 opacity-50">
                     <ArrowRight className="w-8 h-8" />
                     <span>Kết quả sẽ hiển thị tại đây</span>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default TikZGenerator;
