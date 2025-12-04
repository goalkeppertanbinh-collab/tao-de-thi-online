
import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import ResultDisplay from "./components/ResultDisplay";
import TikZGenerator from "./components/TikZGenerator";
import { DEFAULT_PARAMS } from "./constants";
import { generateMathTest } from "./services/geminiService";
import { TestParams, GenerationState } from "./types";
import { Calculator, Settings2, FileText, PenTool } from "lucide-react";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"config" | "result" | "tikz">("config");
  const [params, setParams] = useState<TestParams>(DEFAULT_PARAMS);
  const [apiKey, setApiKey] = useState<string>("");
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      alert("Vui lòng nhập API Key!");
      return;
    }
    setActiveTab("result"); // Switch to result tab automatically
    setState({ isLoading: true, result: null, error: null });
    try {
      const result = await generateMathTest(params, apiKey);
      setState({ isLoading: false, result, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
      setState({ isLoading: false, result: null, error: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg"><Calculator className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-xl font-bold text-slate-900 leading-tight">THCS MathGen 7991</h1><p className="text-xs text-slate-500 font-medium">Trợ lý tạo đề kiểm tra Toán</p></div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab("config")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "config" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                <Settings2 className="w-4 h-4" /> Thiết lập & Ma trận
             </button>
             <button 
                onClick={() => setActiveTab("result")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "result" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                <FileText className="w-4 h-4" /> Kết quả & Tải về
             </button>
             <button 
                onClick={() => setActiveTab("tikz")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "tikz" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                <PenTool className="w-4 h-4" /> Vẽ hình TikZ
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-full min-h-[600px] print:h-auto print:block">
           {activeTab === "config" && (
              <InputForm 
                  params={params} 
                  setParams={setParams} 
                  onGenerate={handleGenerate} 
                  isLoading={state.isLoading} 
                  apiKey={apiKey} 
                  setApiKey={handleApiKeyChange} 
              />
           )}
           {activeTab === "result" && (
              <ResultDisplay result={state.result} error={state.error} params={params} isLoading={state.isLoading} />
           )}
           {activeTab === "tikz" && (
              <TikZGenerator apiKey={apiKey} setApiKey={handleApiKeyChange} />
           )}
        </div>
      </main>
    </div>
  );
};

export default App;
