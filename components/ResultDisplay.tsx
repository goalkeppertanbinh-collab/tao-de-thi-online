
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Download, FileWarning, FileText, FileSpreadsheet, Copy, Check, Database, ChevronDown, CheckCircle, Eye, EyeOff, Table, Archive, FileCheck, ChevronUp, FileType } from "lucide-react";
import { exportToWord, exportMatrixDocx, exportSpecDocx, exportBankDocx, generateMatrixBlob, generateSpecBlob, generateBankBlob, generateWordBlob } from "../utils/docxGenerator";
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
  const [isExportingHDC, setIsExportingHDC] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  
  const [showPreview, setShowPreview] = useState(false);

  // --- HELPER: EXTRACT CONTENT ---
  const extractContent = (fullText: string, setIndex: number, type: 'test' | 'hdc') => {
      const currentSetHeaderRegex = new RegExp(`##\\s*BỘ ĐỀ SỐ\\s*${setIndex + 1}`, 'i');
      const nextSetHeaderRegex = new RegExp(`##\\s*BỘ ĐỀ SỐ\\s*${setIndex + 2}`, 'i');
      const hdcRegex = /###\s*ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM/i;
      const bankHeaderRegex = /##\s*NGÂN HÀNG CÂU HỎI/i;

      // 1. Isolate the specific Set Block (from "Bộ đề số X" to "Bộ đề số X+1" or "Ngân hàng")
      const split1 = fullText.split(currentSetHeaderRegex);
      if (split1.length < 2) return "";
      
      let setContent = "## BỘ ĐỀ SỐ " + (setIndex + 1) + split1[1];
      
      // Cut off next set
      if (nextSetHeaderRegex.test(setContent)) {
          setContent = setContent.split(nextSetHeaderRegex)[0];
      }
      // Cut off bank if it's the last set
      if (bankHeaderRegex.test(setContent)) {
          setContent = setContent.split(bankHeaderRegex)[0];
      }

      // 2. Split Test Questions vs HDC
      const parts = setContent.split(hdcRegex);
      const testPart = parts[0];
      const hdcPart = parts.length > 1 ? "### ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM" + parts.slice(1).join("### ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM") : "";

      if (type === 'test') return testPart.trim();
      if (type === 'hdc') return hdcPart.trim();
      return setContent;
  };

  const handleDownloadSet = async (setIndex: number) => {
    if (!result || !params) return;
    setIsExporting(true);
    
    try {
      const setConfig = params.testSets[setIndex];
      // File name for Test Only
      const filename = `${setConfig.fileName || `De_Kiem_Tra_So${setIndex+1}`}_De_Thi.docx`;
      
      // Extract ONLY the Test part (remove HDC)
      const content = extractContent(result, setIndex, 'test');
      
      if (!content) {
          alert("Không tìm thấy nội dung đề thi.");
          return;
      }

      await exportToWord(content, filename, `ĐỀ KIỂM TRA SỐ ${setIndex+1}`);
    } catch (e) {
      console.error("Export failed", e);
      alert("Xuất file thất bại.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadHDC = async () => {
      if (!result || !params) return;
      setIsExportingHDC(true);
      try {
          let fullHDC = "";
          // Loop through all sets and aggregate HDC
          for (let i = 0; i < params.testSets.length; i++) {
              const hdcContent = extractContent(result, i, 'hdc');
              if (hdcContent) {
                  fullHDC += hdcContent + "\n\n---\n\n";
              }
          }

          if (!fullHDC.trim()) {
              alert("Không tìm thấy nội dung Hướng dẫn chấm.");
              return;
          }

          const filename = `${params.testSets[0]?.fileName || 'De_Thi'}_Huong_Dan_Cham.docx`;
          await exportToWord(fullHDC, filename, "HƯỚNG DẪN CHẤM CHI TIẾT");
      } catch (e) {
          console.error("Export HDC failed", e);
          alert("Xuất file HDC thất bại.");
      } finally {
          setIsExportingHDC(false);
      }
  };

  const handleDownloadAll = async () => {
    if (!result || !params) return;
    setIsExportingAll(true);
    
    try {
        const JSZipModule = await import("jszip");
        const JSZip = JSZipModule.default || JSZipModule;
        const zip = new JSZip();
        
        const folderName = params.testSets[0]?.fileName || "Bo_De_Thi";

        // 1. Matrix
        try {
            const matrixBlob = await generateMatrixBlob(params);
            zip.file(`${folderName}_Ma_Tran.docx`, matrixBlob);
        } catch(e) { console.error("Skip Matrix", e); }

        // 2. Spec
        try {
            const specBlob = await generateSpecBlob(params);
            zip.file(`${folderName}_Dac_Ta.docx`, specBlob);
        } catch(e) { console.error("Skip Spec", e); }

        // 3. Question Bank
        try {
            const bankBlob = await generateBankBlob(result, params);
            zip.file(`${folderName}_Ngan_Hang_Cau_Hoi.docx`, bankBlob);
        } catch(e) { console.error("Skip Bank", e); }

        // 4. Test Sets (Questions Only) AND HDC
        let combinedHDC = "";

        for (let i = 0; i < params.testSets.length; i++) {
             const setIndex = i;
             const setConfig = params.testSets[setIndex];
             
             // Get Test Only
             const testContent = extractContent(result, setIndex, 'test');
             if (testContent) {
                 const setBlob = await generateWordBlob(testContent, `ĐỀ KIỂM TRA SỐ ${setIndex+1}`);
                 const filename = `${setConfig.fileName || `De_Kiem_Tra_So${setIndex+1}`}_De_Thi.docx`;
                 zip.file(filename, setBlob);
             }

             // Get HDC
             const hdcContent = extractContent(result, setIndex, 'hdc');
             if (hdcContent) {
                 combinedHDC += hdcContent + "\n\n---\n\n";
             }
        }

        // 5. Save Combined HDC
        if (combinedHDC) {
            const hdcBlob = await generateWordBlob(combinedHDC, "HƯỚNG DẪN CHẤM TỔNG HỢP");
            zip.file(`${folderName}_Huong_Dan_Cham_Full.docx`, hdcBlob);
        }

        // Generate Zip
        const zipContent = await zip.generateAsync({type:"blob"});
        const fileSaverModule = await import("file-saver");
        const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;
        saveAs(zipContent, `${folderName}_Tron_Bo.zip`);

    } catch (e) {
        console.error("Batch download failed", e);
        alert("Lỗi khi nén file.");
    } finally {
        setIsExportingAll(false);
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
      
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar pb-20">
        {!showPreview ? (
            <div className="flex flex-col items-center justify-center min-h-full p-6 space-y-6">
                
                {/* 1. SECTION: DOWNLOAD ALL */}
                <div className="w-full max-w-5xl">
                     <button 
                        onClick={handleDownloadAll} 
                        disabled={isExportingAll} 
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-3 text-lg transition-transform transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {isExportingAll ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : <Archive className="w-6 h-6" />}
                        Tải Trọn Bộ (Full ZIP)
                     </button>
                     <p className="text-center text-xs text-slate-400 mt-2">Bao gồm tất cả file bên dưới, được nén thành 1 file .zip duy nhất.</p>
                </div>

                {/* 2. SECTION: SYSTEM FILES (MATRIX, SPEC, HDC, BANK) */}
                <div className="w-full max-w-5xl">
                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4"/> Hồ sơ đề thi</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Matrix */}
                        <button onClick={handleDownloadMatrix} disabled={isExportingMatrix} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white rounded-full text-blue-600 border border-slate-100 group-hover:scale-110 transition-transform">
                                {isExportingMatrix ? <Spinner /> : <FileSpreadsheet className="w-6 h-6" />}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Ma trận đề thi</span>
                        </button>

                        {/* Specification */}
                        <button onClick={handleDownloadSpec} disabled={isExportingSpec} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow hover:border-cyan-300 hover:bg-cyan-50 transition-all flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white rounded-full text-cyan-600 border border-slate-100 group-hover:scale-110 transition-transform">
                                {isExportingSpec ? <Spinner /> : <FileType className="w-6 h-6" />}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Bảng đặc tả</span>
                        </button>

                        {/* Question Bank */}
                        <button onClick={handleDownloadBank} disabled={isExportingBank} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow hover:border-purple-300 hover:bg-purple-50 transition-all flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white rounded-full text-purple-600 border border-slate-100 group-hover:scale-110 transition-transform">
                                {isExportingBank ? <Spinner /> : <Database className="w-6 h-6" />}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Ngân hàng câu hỏi</span>
                        </button>

                         {/* HDC */}
                         <button onClick={handleDownloadHDC} disabled={isExportingHDC} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow hover:border-orange-300 hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white rounded-full text-orange-600 border border-slate-100 group-hover:scale-110 transition-transform">
                                {isExportingHDC ? <Spinner /> : <FileCheck className="w-6 h-6" />}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Hướng dẫn chấm</span>
                        </button>
                    </div>
                </div>

                {/* 3. SECTION: TEST SETS LIST (Grid instead of dropdown) */}
                <div className="w-full max-w-5xl">
                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> Danh sách Đề thi (Chỉ câu hỏi)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {params?.testSets.map((set, idx) => (
                            <button 
                                key={set.id} 
                                onClick={() => handleDownloadSet(idx)} 
                                disabled={isExporting}
                                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:shadow-md transition-all group text-left"
                            >
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">Bộ đề số {idx + 1}</div>
                                    <div className="text-xs text-slate-500 mt-1">Mã: {set.specificCodes}</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {isExporting ? <Spinner /> : <Download className="w-4 h-4" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="p-8">
                <div className="max-w-4xl mx-auto markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>{result}</ReactMarkdown>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const Spinner = () => <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>;
export default ResultDisplay;
