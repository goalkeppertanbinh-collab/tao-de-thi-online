
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Download, FileWarning, FileText, FileSpreadsheet, Copy, Check, Database, ChevronDown, CheckCircle, Eye, EyeOff, Table } from "lucide-react";
import { exportToWord, exportMatrixDocx, exportSpecDocx, exportBankDocx } from "../utils/docxGenerator";
import { TestParams } from "../types";

interface ResultDisplayProps {
  result: string | null;
  error: string | null;
  params?: TestParams;
  isLoading?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error, params, isLoading }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingMatrix, setIsExportingMatrix] = useState(false);
  const [isExportingSpec, setIsExportingSpec] = useState(false);
  const [isExportingBank, setIsExportingBank] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadSet = async (setIndex: number) => {
    if (!result || !params) return;
    setIsExporting(true);
    setShowDownloadMenu(false);
    
    try {
      const setConfig = params.testSets[setIndex];
      const filename = `${setConfig.fileName || `De_Kiem_Tra_So${setIndex+1}`}.docx`;
      
      const fullText = result;
      // Regex to find start of this set
      const currentSetHeaderRegex = new RegExp(`##\\s*BỘ ĐỀ SỐ\\s*${setIndex + 1}`, 'i');
      const nextSetHeaderRegex = new RegExp(`##\\s*BỘ ĐỀ SỐ\\s*${setIndex + 2}`, 'i');
      const bankHeaderRegex = /##\s*NGÂN HÀNG CÂU HỎI/i;

      const split1 = fullText.split(currentSetHeaderRegex);
      
      if (split1.length < 2) {
         console.warn("Could not find set header, downloading full.");
         await exportToWord(fullText, filename, `ĐỀ KIỂM TRA`);
         return;
      }

      let content = "## BỘ ĐỀ SỐ " + (setIndex + 1) + split1[1];

      if (nextSetHeaderRegex.test(content)) content = content.split(nextSetHeaderRegex)[0];
      if (bankHeaderRegex.test(content)) content = content.split(bankHeaderRegex)[0];

      await exportToWord(content, filename, `ĐỀ KIỂM TRA SỐ ${setIndex+1}`);
    } catch (e) {
      console.error("Export failed", e);
      alert("Xuất file thất bại.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadBank = async () => {
    if (!result || !params) return;
    setIsExportingBank(true);
    try {
      await exportBankDocx(result, params);
    } catch (e) { console.error(e); alert("Lỗi xuất file ngân hàng."); } 
    finally { setIsExportingBank(false); }
  };

  const handleDownloadMatrix = async () => {
      if (!params) return;
      setIsExportingMatrix(true);
      try { await exportMatrixDocx(params); } catch (e) { alert("Lỗi xuất ma trận."); console.error(e); } 
      finally { setIsExportingMatrix(false); }
  };

  const handleDownloadSpec = async () => {
      if (!params) return;
      setIsExportingSpec(true);
      try { await exportSpecDocx(params); } catch (e) { alert("Lỗi xuất bảng đặc tả."); console.error(e); } 
      finally { setIsExportingSpec(false); }
  };

  if (isLoading) return <div className="h-full bg-white rounded-xl shadow border border-blue-100 flex flex-col items-center justify-center p-8 text-center min-h-[400px]"><div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div><p className="text-blue-600 font-medium">Đang khởi tạo đề thi...</p><p className="text-slate-400 text-sm mt-2">Vui lòng chờ trong giây lát</p></div>;
  if (error) return <div className="h-full bg-white rounded-xl shadow border border-red-200 flex flex-col items-center justify-center p-8 text-center text-red-600 min-h-[400px]"><FileWarning className="w-12 h-12 mb-4" /><p>{error}</p></div>;
  if (!result) return <div className="h-full bg-white rounded-xl shadow border border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px]"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6"><FileText className="w-10 h-10 text-slate-300" /></div><h3 className="text-xl font-bold text-slate-800">Chưa có kết quả</h3><p className="text-slate-500">Hãy thiết lập thông số và nhấn "Tạo Đề Thi" ở tab bên cạnh.</p></div>;

  const multiSet = params && params.testSets.length > 1;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-wrap gap-2">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Dashboard Tải Về
        </h2>
        <div className="flex gap-2">
             {!showPreview ? 
                <button onClick={() => setShowPreview(true)} className="icon-btn"><Eye className="w-4 h-4" /> Xem trước</button> 
                : 
                <button onClick={() => setShowPreview(false)} className="icon-btn"><EyeOff className="w-4 h-4" /> Đóng xem trước</button>
             }
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {!showPreview ? (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Đề thi đã sẵn sàng!</h3>
                    <p className="text-slate-500">Chọn định dạng bạn muốn tải về bên dưới</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full max-w-5xl">
                    {/* Matrix Card */}
                    <button onClick={handleDownloadMatrix} disabled={isExportingMatrix} className="p-6 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                            {isExportingMatrix ? <Spinner /> : <FileSpreadsheet className="w-6 h-6" />}
                        </div>
                        <div className="font-bold text-green-800">Tải Ma trận</div>
                        <span className="text-xs text-green-600 bg-white px-2 py-0.5 rounded-full">Word (.docx)</span>
                    </button>

                    {/* Spec Card */}
                    <button onClick={handleDownloadSpec} disabled={isExportingSpec} className="p-6 bg-teal-50 border border-teal-200 rounded-xl hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-teal-600 group-hover:scale-110 transition-transform">
                            {isExportingSpec ? <Spinner /> : <Table className="w-6 h-6" />}
                        </div>
                        <div className="font-bold text-teal-800">Tải Bảng Đặc Tả</div>
                        <span className="text-xs text-teal-600 bg-white px-2 py-0.5 rounded-full">Word (.docx)</span>
                    </button>

                    {/* Question Bank Card */}
                    <button onClick={handleDownloadBank} disabled={isExportingBank} className="p-6 bg-purple-50 border border-purple-200 rounded-xl hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                            {isExportingBank ? <Spinner /> : <Database className="w-6 h-6" />}
                        </div>
                        <div className="font-bold text-purple-800">Ngân hàng Câu hỏi</div>
                        <span className="text-xs text-purple-600 bg-white px-2 py-0.5 rounded-full">Word (.docx)</span>
                    </button>

                    {/* Test Sets Card */}
                    {multiSet ? (
                        <div className="relative group w-full">
                            <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="w-full h-full p-6 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-md transition-all flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="font-bold text-blue-800 flex items-center gap-1">Tải các Bộ đề <ChevronDown className="w-4 h-4" /></div>
                                <span className="text-xs text-blue-600 bg-white px-2 py-0.5 rounded-full">Word (.docx)</span>
                            </button>
                            {showDownloadMenu && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-10 py-1 overflow-hidden">
                                    {params?.testSets.map((set, idx) => (
                                        <button key={set.id} onClick={() => handleDownloadSet(idx)} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between border-b last:border-0 border-slate-50">
                                            <span>Bộ đề {idx + 1} ({set.specificCodes})</span>
                                            <Download className="w-3 h-3" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => handleDownloadSet(0)} disabled={isExporting} className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                {isExporting ? <Spinner /> : <FileText className="w-6 h-6" />}
                            </div>
                            <div className="font-bold text-blue-800">Tải Đề thi</div>
                            <span className="text-xs text-blue-600 bg-white px-2 py-0.5 rounded-full">Word (.docx)</span>
                        </button>
                    )}
                </div>
            </div>
        ) : (
            <div className="p-8">
                <div className="max-w-4xl mx-auto markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{result}</ReactMarkdown>
                </div>
            </div>
        )}
      </div>
      {showDownloadMenu && <div className="fixed inset-0 z-0 bg-transparent" onClick={() => setShowDownloadMenu(false)}></div>}
    </div>
  );
};

const Spinner = () => <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>;
export default ResultDisplay;
