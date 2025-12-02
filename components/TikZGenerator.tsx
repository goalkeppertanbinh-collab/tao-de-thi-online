
import React, { useState } from "react";
import { generateTikZCode } from "../services/geminiService";
import { PenTool, Copy, Check, Code } from "lucide-react";

const TikZGenerator: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGen = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await generateTikZCode(prompt, apiKey);
      setCode(res);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
             <PenTool className="w-5 h-5 text-purple-600" /> Mô tả hình học
          </h3>
          <textarea 
             className="w-full flex-1 p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm"
             placeholder="Ví dụ: Vẽ tam giác ABC vuông tại A, có đường cao AH. Kẻ trung tuyến AM..."
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
             onClick={handleGen} 
             disabled={loading || !prompt}
             className="mt-4 w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
             {loading ? "Đang tạo mã..." : "Tạo mã TikZ"}
          </button>
       </div>

       <div className="bg-slate-900 p-6 rounded-xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-200 flex items-center gap-2"><Code className="w-5 h-5" /> Mã LaTeX / TikZ</h3>
             {code && (
                <button onClick={copyToClipboard} className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                   {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                </button>
             )}
          </div>
          <div className="flex-1 bg-slate-950 rounded-lg p-4 font-mono text-xs text-green-400 overflow-auto custom-scrollbar border border-slate-800">
             {code ? <pre>{code}</pre> : <span className="text-slate-600 italic">Mã kết quả sẽ hiện ở đây...</span>}
          </div>
       </div>
    </div>
  );
};

export default TikZGenerator;
