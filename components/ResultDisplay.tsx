
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Download, FileWarning, FileText, FileSpreadsheet, Copy, Check, Database, ChevronDown, CheckCircle, Eye, EyeOff, Table, Archive, FileCheck, ChevronUp, FileType, X, Printer } from "lucide-react";
import { exportToWord, exportMatrixDocx, exportSpecDocx, exportBankDocx, generateMatrixBlob, generateSpecBlob, generateBankBlob, generateWordBlob } from "../utils/docxGenerator";
import { TestParams, Topic } from "../types";

interface ResultDisplayProps {
  result: string | null;
  error: string | null;
  params?: TestParams;
  isLoading?: boolean;
}

interface PreviewData {
  title: string;
  type: 'markdown' | 'matrix' | 'spec';
  content?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error, params, isLoading }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingMatrix, setIsExportingMatrix] = useState(false);
  const [isExportingSpec, setIsExportingSpec] = useState(false);
  const [isExportingBank, setIsExportingBank] = useState(false);
  const [isExportingHDC, setIsExportingHDC] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // --- HELPER: EXTRACT CONTENT ---
  const extractContent = (fullText: string, setIndex: number, type: 'test' | 'hdc' | 'bank') => {
      if (type === 'bank') {
         const bankHeaderRegex = /##\s*NGÂN HÀNG CÂU HỎI/i;
         const parts = fullText.split(bankHeaderRegex);
         return parts.length > 1 ? `## NGÂN HÀNG CÂU HỎI\n${parts[1]}` : "";
      }

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

  // --- HTML RENDERERS FOR STRUCTURED PREVIEWS ---
  
  const renderMatrixHTML = () => {
    if (!params) return null;
    const { topics, pointValues } = params;
    let totalScore = 0;
    const totals = { mc: {nb:0,th:0,vd:0}, tf: {nb:0,th:0,vd:0}, sa: {nb:0,th:0,vd:0}, es: {nb:0,th:0,vd:0} };

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th rowSpan={4} className="border border-slate-300 p-2">TT</th>
              <th rowSpan={4} className="border border-slate-300 p-2">Chủ đề</th>
              <th rowSpan={4} className="border border-slate-300 p-2">Nội dung</th>
              <th colSpan={12} className="border border-slate-300 p-2">Mức độ đánh giá</th>
              <th colSpan={3} className="border border-slate-300 p-2">Tổng</th>
              <th rowSpan={4} className="border border-slate-300 p-2">%</th>
            </tr>
            <tr className="bg-slate-100">
              <th colSpan={9} className="border border-slate-300 p-1">Trắc nghiệm KQ</th>
              <th colSpan={3} className="border border-slate-300 p-1">Tự luận</th>
              <th rowSpan={3} className="border border-slate-300 p-1">NB</th>
              <th rowSpan={3} className="border border-slate-300 p-1">TH</th>
              <th rowSpan={3} className="border border-slate-300 p-1">VD</th>
            </tr>
            <tr className="bg-slate-100">
              <th colSpan={3} className="border border-slate-300 p-1">Nhiều lựa chọn</th>
              <th colSpan={3} className="border border-slate-300 p-1">Đúng/Sai</th>
              <th colSpan={3} className="border border-slate-300 p-1">Trả lời ngắn</th>
              <th colSpan={3} className="border border-slate-300 p-1">Tự luận</th>
            </tr>
            <tr className="bg-slate-100">
               {[1,2,3,4].flatMap(() => [<th key="b" className="border p-1">B</th>, <th key="h" className="border p-1">H</th>, <th key="v" className="border p-1">V</th>])}
            </tr>
          </thead>
          <tbody>
            {topics.map((t, idx) => {
               const m = t.matrix;
               const sum = (l:any) => (l.recognition||0) + (l.comprehension||0) + (l.application||0);
               const tScore = sum(m.multipleChoice)*pointValues.multipleChoice + sum(m.trueFalse)*pointValues.trueFalse + sum(m.shortAnswer)*pointValues.shortAnswer + sum(m.essay)*pointValues.essay;
               totalScore += tScore;
               
               // Accumulate
               totals.mc.nb += m.multipleChoice.recognition; totals.mc.th += m.multipleChoice.comprehension; totals.mc.vd += m.multipleChoice.application;
               totals.tf.nb += m.trueFalse.recognition; totals.tf.th += m.trueFalse.comprehension; totals.tf.vd += m.trueFalse.application;
               totals.sa.nb += m.shortAnswer.recognition; totals.sa.th += m.shortAnswer.comprehension; totals.sa.vd += m.shortAnswer.application;
               totals.es.nb += m.essay.recognition; totals.es.th += m.essay.comprehension; totals.es.vd += m.essay.application;

               return (
                 <tr key={t.id}>
                   <td className="border border-slate-300 p-1 text-center">{idx+1}</td>
                   <td className="border border-slate-300 p-1">{t.parentName}</td>
                   <td className="border border-slate-300 p-1">{t.name}</td>
                   {/* MC */}
                   <td className="border border-slate-300 p-1 text-center">{m.multipleChoice.recognition || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.multipleChoice.comprehension || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.multipleChoice.application || ""}</td>
                   {/* TF */}
                   <td className="border border-slate-300 p-1 text-center">{m.trueFalse.recognition || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.trueFalse.comprehension || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.trueFalse.application || ""}</td>
                   {/* SA */}
                   <td className="border border-slate-300 p-1 text-center">{m.shortAnswer.recognition || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.shortAnswer.comprehension || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.shortAnswer.application || ""}</td>
                   {/* ES */}
                   <td className="border border-slate-300 p-1 text-center">{m.essay.recognition || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.essay.comprehension || ""}</td>
                   <td className="border border-slate-300 p-1 text-center">{m.essay.application || ""}</td>
                   
                   {/* Totals */}
                   <td className="border border-slate-300 p-1 text-center font-bold bg-slate-50">{m.multipleChoice.recognition + m.trueFalse.recognition + m.shortAnswer.recognition + m.essay.recognition}</td>
                   <td className="border border-slate-300 p-1 text-center font-bold bg-slate-50">{m.multipleChoice.comprehension + m.trueFalse.comprehension + m.shortAnswer.comprehension + m.essay.comprehension}</td>
                   <td className="border border-slate-300 p-1 text-center font-bold bg-slate-50">{m.multipleChoice.application + m.trueFalse.application + m.shortAnswer.application + m.essay.application}</td>
                   <td className="border border-slate-300 p-1 text-center">{(tScore * 10).toFixed(0)}%</td>
                 </tr>
               )
            })}
            <tr className="font-bold bg-slate-100">
               <td colSpan={3} className="border border-slate-300 p-2 text-center">Tổng số câu</td>
               <td className="border border-slate-300 p-1 text-center">{totals.mc.nb}</td><td className="border border-slate-300 p-1 text-center">{totals.mc.th}</td><td className="border border-slate-300 p-1 text-center">{totals.mc.vd}</td>
               <td className="border border-slate-300 p-1 text-center">{totals.tf.nb}</td><td className="border border-slate-300 p-1 text-center">{totals.tf.th}</td><td className="border border-slate-300 p-1 text-center">{totals.tf.vd}</td>
               <td className="border border-slate-300 p-1 text-center">{totals.sa.nb}</td><td className="border border-slate-300 p-1 text-center">{totals.sa.th}</td><td className="border border-slate-300 p-1 text-center">{totals.sa.vd}</td>
               <td className="border border-slate-300 p-1 text-center">{totals.es.nb}</td><td className="border border-slate-300 p-1 text-center">{totals.es.th}</td><td className="border border-slate-300 p-1 text-center">{totals.es.vd}</td>
               <td colSpan={4} className="border border-slate-300 p-1 text-center"></td>
            </tr>
            <tr className="font-bold bg-yellow-50">
               <td colSpan={3} className="border border-slate-300 p-2 text-center">Tổng điểm</td>
               <td colSpan={3} className="border border-slate-300 p-1 text-center text-red-600">{((totals.mc.nb+totals.mc.th+totals.mc.vd)*pointValues.multipleChoice).toFixed(1)}</td>
               <td colSpan={3} className="border border-slate-300 p-1 text-center text-red-600">{((totals.tf.nb+totals.tf.th+totals.tf.vd)*pointValues.trueFalse).toFixed(1)}</td>
               <td colSpan={3} className="border border-slate-300 p-1 text-center text-red-600">{((totals.sa.nb+totals.sa.th+totals.sa.vd)*pointValues.shortAnswer).toFixed(1)}</td>
               <td colSpan={3} className="border border-slate-300 p-1 text-center text-red-600">{((totals.es.nb+totals.es.th+totals.es.vd)*pointValues.essay).toFixed(1)}</td>
               <td colSpan={3} className="border border-slate-300 p-1 text-center bg-yellow-100 text-lg">{totalScore.toFixed(2)}</td>
               <td className="border border-slate-300 p-1 text-center">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderSpecHTML = () => {
    if (!params) return null;
    let counter = { mc: 1, tf: 0, sa: 0, es: 0 };
    // Pre-calc starts
    const sumT = (type: 'multipleChoice'|'trueFalse'|'shortAnswer'|'essay') => params.topics.reduce((acc, t) => acc + (t.matrix[type].recognition||0)+(t.matrix[type].comprehension||0)+(t.matrix[type].application||0), 0);
    counter.tf = counter.mc + sumT('multipleChoice');
    counter.sa = counter.tf + sumT('trueFalse');
    counter.es = counter.sa + sumT('shortAnswer');

    const renderRange = (count: number, current: number, label: string) => {
        if (count <= 0) return <td className="border border-slate-300 p-1"></td>;
        const end = current + count - 1;
        const txt = count === 1 ? `C${current}` : `C${current}-C${end}`;
        return <td className="border border-slate-300 p-1 text-center text-[10px]"><div className="font-bold">{txt}</div><div className="text-slate-500">{label}</div></td>;
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-100">
               <th rowSpan={4} className="border p-2">TT</th>
               <th rowSpan={4} className="border p-2">Chủ đề</th>
               <th rowSpan={4} className="border p-2">Nội dung</th>
               <th rowSpan={4} className="border p-2 w-1/4">Yêu cầu cần đạt</th>
               <th colSpan={12} className="border p-2">Số câu hỏi</th>
            </tr>
            <tr className="bg-slate-100"><th colSpan={9} className="border p-1">TNKQ</th><th colSpan={3} className="border p-1">TL</th></tr>
            <tr className="bg-slate-100">
                <th colSpan={3} className="border p-1">Nhiều lựa chọn</th>
                <th colSpan={3} className="border p-1">Đúng/Sai</th>
                <th colSpan={3} className="border p-1">Trả lời ngắn</th>
                <th colSpan={3} className="border p-1">Tự luận</th>
            </tr>
            <tr className="bg-slate-100">
                {[1,2,3,4].flatMap(() => [<th key="b" className="border p-1">B</th>, <th key="h" className="border p-1">H</th>, <th key="v" className="border p-1">V</th>])}
            </tr>
          </thead>
          <tbody>
              {params.topics.map((t, idx) => {
                  const m = t.matrix;
                  const row = (
                      <tr key={t.id}>
                          <td className="border border-slate-300 p-1 text-center">{idx+1}</td>
                          <td className="border border-slate-300 p-1">{t.parentName}</td>
                          <td className="border border-slate-300 p-1 font-bold">{t.name}</td>
                          <td className="border border-slate-300 p-1 text-xs italic">{t.description}</td>
                          {/* MC */}
                          {renderRange(m.multipleChoice.recognition, counter.mc, "TDLL")} {m.multipleChoice.recognition > 0 && (counter.mc += m.multipleChoice.recognition)}
                          {renderRange(m.multipleChoice.comprehension, counter.mc, "MHH")} {m.multipleChoice.comprehension > 0 && (counter.mc += m.multipleChoice.comprehension)}
                          {renderRange(m.multipleChoice.application, counter.mc, "GQVĐ")} {m.multipleChoice.application > 0 && (counter.mc += m.multipleChoice.application)}
                           {/* TF */}
                          {renderRange(m.trueFalse.recognition, counter.tf, "TDLL")} {m.trueFalse.recognition > 0 && (counter.tf += m.trueFalse.recognition)}
                          {renderRange(m.trueFalse.comprehension, counter.tf, "GTTH")} {m.trueFalse.comprehension > 0 && (counter.tf += m.trueFalse.comprehension)}
                          {renderRange(m.trueFalse.application, counter.tf, "GQVĐ")} {m.trueFalse.application > 0 && (counter.tf += m.trueFalse.application)}
                          {/* SA */}
                          {renderRange(m.shortAnswer.recognition, counter.sa, "TDLL")} {m.shortAnswer.recognition > 0 && (counter.sa += m.shortAnswer.recognition)}
                          {renderRange(m.shortAnswer.comprehension, counter.sa, "MHH")} {m.shortAnswer.comprehension > 0 && (counter.sa += m.shortAnswer.comprehension)}
                          {renderRange(m.shortAnswer.application, counter.sa, "GQVĐ")} {m.shortAnswer.application > 0 && (counter.sa += m.shortAnswer.application)}
                          {/* ES */}
                          {renderRange(m.essay.recognition, counter.es, "TDLL")} {m.essay.recognition > 0 && (counter.es += m.essay.recognition)}
                          {renderRange(m.essay.comprehension, counter.es, "GTTH")} {m.essay.comprehension > 0 && (counter.es += m.essay.comprehension)}
                          {renderRange(m.essay.application, counter.es, "GQVĐ")} {m.essay.application > 0 && (counter.es += m.essay.application)}
                      </tr>
                  );
                  return row;
              })}
          </tbody>
        </table>
      </div>
    )
  }

  // --- ACTIONS ---

  const handleDownloadSet = async (setIndex: number) => {
    if (!result || !params) return;
    setIsExporting(true);
    try {
      const setConfig = params.testSets[setIndex];
      const filename = `${setConfig.fileName || `De_Kiem_Tra_So${setIndex+1}`}_De_Thi.docx`;
      const content = extractContent(result, setIndex, 'test');
      if (!content) { alert("Không tìm thấy nội dung đề thi."); return; }
      await exportToWord(content, filename, `ĐỀ KIỂM TRA SỐ ${setIndex+1}`);
    } catch (e) { console.error("Export failed", e); alert("Xuất file thất bại."); } finally { setIsExporting(false); }
  };

  const handlePreviewSet = (setIndex: number) => {
      if (!result) return;
      const content = extractContent(result, setIndex, 'test');
      if (content) setPreviewData({ title: `Xem trước: Bộ đề số ${setIndex + 1}`, type: 'markdown', content });
  };

  const handleDownloadHDC = async () => {
      if (!result || !params) return;
      setIsExportingHDC(true);
      try {
          let fullHDC = "";
          for (let i = 0; i < params.testSets.length; i++) {
              const hdcContent = extractContent(result, i, 'hdc');
              if (hdcContent) fullHDC += hdcContent + "\n\n---\n\n";
          }
          if (!fullHDC.trim()) { alert("Không tìm thấy nội dung Hướng dẫn chấm."); return; }
          const filename = `${params.testSets[0]?.fileName || 'De_Thi'}_Huong_Dan_Cham.docx`;
          await exportToWord(fullHDC, filename, "HƯỚNG DẪN CHẤM CHI TIẾT");
      } catch (e) { alert("Xuất file HDC thất bại."); } finally { setIsExportingHDC(false); }
  };

  const handlePreviewHDC = () => {
      if (!result || !params) return;
      let fullHDC = "";
      for (let i = 0; i < params.testSets.length; i++) {
          const hdcContent = extractContent(result, i, 'hdc');
          if (hdcContent) fullHDC += hdcContent + "\n\n---\n\n";
      }
      if (fullHDC) setPreviewData({ title: "Xem trước: Hướng dẫn chấm", type: 'markdown', content: fullHDC });
  }

  const handleDownloadBank = async () => {
    if (!result || !params) return;
    setIsExportingBank(true);
    try { await exportBankDocx(result, params); } catch (e) { alert("Lỗi xuất file ngân hàng."); } finally { setIsExportingBank(false); }
  };

  const handlePreviewBank = () => {
      if (!result) return;
      const content = extractContent(result, 0, 'bank');
      if (content) setPreviewData({ title: "Xem trước: Ngân hàng câu hỏi", type: 'markdown', content });
  }

  const handleDownloadMatrix = async () => {
      if (!params) return;
      setIsExportingMatrix(true);
      try { await exportMatrixDocx(params); } catch (e) { alert("Lỗi xuất ma trận."); } finally { setIsExportingMatrix(false); }
  };

  const handlePreviewMatrix = () => {
      if (params) setPreviewData({ title: "Xem trước: Ma trận đề thi", type: 'matrix' });
  }

  const handleDownloadSpec = async () => {
      if (!params) return;
      setIsExportingSpec(true);
      try { await exportSpecDocx(params); } catch (e) { alert("Lỗi xuất bảng đặc tả."); } finally { setIsExportingSpec(false); }
  };

  const handlePreviewSpec = () => {
      if (params) setPreviewData({ title: "Xem trước: Bảng đặc tả", type: 'spec' });
  }

  const handleDownloadAll = async () => {
    if (!result || !params) return;
    setIsExportingAll(true);
    try {
        const JSZipModule = await import("jszip");
        const JSZip = JSZipModule.default;
        const zip = new JSZip();
        const folderName = params.testSets[0]?.fileName || "Bo_De_Thi";

        try { const matrixBlob = await generateMatrixBlob(params); zip.file(`${folderName}_Ma_Tran.docx`, matrixBlob); } catch(e){}
        try { const specBlob = await generateSpecBlob(params); zip.file(`${folderName}_Dac_Ta.docx`, specBlob); } catch(e){}
        try { const bankBlob = await generateBankBlob(result, params); zip.file(`${folderName}_Ngan_Hang_Cau_Hoi.docx`, bankBlob); } catch(e){}

        let combinedHDC = "";
        for (let i = 0; i < params.testSets.length; i++) {
             const setIndex = i;
             const setConfig = params.testSets[setIndex];
             const testContent = extractContent(result, setIndex, 'test');
             if (testContent) {
                 const setBlob = await generateWordBlob(testContent, `ĐỀ KIỂM TRA SỐ ${setIndex+1}`);
                 zip.file(`${setConfig.fileName || `De_Kiem_Tra_So${setIndex+1}`}_De_Thi.docx`, setBlob);
             }
             const hdcContent = extractContent(result, setIndex, 'hdc');
             if (hdcContent) combinedHDC += hdcContent + "\n\n---\n\n";
        }
        if (combinedHDC) {
            const hdcBlob = await generateWordBlob(combinedHDC, "HƯỚNG DẪN CHẤM TỔNG HỢP");
            zip.file(`${folderName}_Huong_Dan_Cham_Full.docx`, hdcBlob);
        }
        const zipContent = await zip.generateAsync({type:"blob"});
        const fileSaverModule = await import("file-saver");
        const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;
        saveAs(zipContent, `${folderName}_Tron_Bo.zip`);
    } catch (e) { alert("Lỗi khi nén file."); } finally { setIsExportingAll(false); }
  };

  if (isLoading) return <div className="h-full bg-white rounded-xl shadow border border-blue-100 flex flex-col items-center justify-center p-8 text-center min-h-[400px]"><div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div><p className="text-blue-600 font-medium">Đang khởi tạo đề thi...</p><p className="text-slate-400 text-sm mt-2">Vui lòng chờ trong giây lát</p></div>;
  if (error) return <div className="h-full bg-white rounded-xl shadow border border-red-200 flex flex-col items-center justify-center p-8 text-center text-red-600 min-h-[400px]"><FileWarning className="w-12 h-12 mb-4" /><p>{error}</p></div>;
  if (!result) return <div className="h-full bg-white rounded-xl shadow border border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px]"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6"><FileText className="w-10 h-10 text-slate-300" /></div><h3 className="text-xl font-bold text-slate-800">Chưa có kết quả</h3><p className="text-slate-500">Hãy thiết lập thông số và nhấn "Tạo Đề Thi" ở tab bên cạnh.</p></div>;

  const Spinner = () => <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden relative">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Dashboard Tải Về
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar pb-20 p-6">
            <div className="flex flex-col items-center justify-center space-y-8">
                
                {/* 1. DOWNLOAD ALL */}
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

                {/* 2. SYSTEM FILES (MATRIX, SPEC, HDC, BANK) */}
                <div className="w-full max-w-5xl">
                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4"/> Hồ sơ đề thi</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Matrix */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full text-blue-600 border border-slate-100"><FileSpreadsheet className="w-6 h-6" /></div>
                                <span className="font-bold text-slate-700 text-sm">Ma trận đề thi</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={handlePreviewMatrix} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"><Eye className="w-3 h-3"/> Xem</button>
                                <button onClick={handleDownloadMatrix} disabled={isExportingMatrix} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200">
                                   {isExportingMatrix ? <Spinner /> : <Download className="w-3 h-3"/>} Tải
                                </button>
                            </div>
                        </div>

                        {/* Spec */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full text-cyan-600 border border-slate-100"><FileType className="w-6 h-6" /></div>
                                <span className="font-bold text-slate-700 text-sm">Bảng đặc tả</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={handlePreviewSpec} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"><Eye className="w-3 h-3"/> Xem</button>
                                <button onClick={handleDownloadSpec} disabled={isExportingSpec} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200">
                                   {isExportingSpec ? <Spinner /> : <Download className="w-3 h-3"/>} Tải
                                </button>
                            </div>
                        </div>

                        {/* Question Bank */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full text-purple-600 border border-slate-100"><Database className="w-6 h-6" /></div>
                                <span className="font-bold text-slate-700 text-sm">Ngân hàng câu hỏi</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={handlePreviewBank} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"><Eye className="w-3 h-3"/> Xem</button>
                                <button onClick={handleDownloadBank} disabled={isExportingBank} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200">
                                   {isExportingBank ? <Spinner /> : <Download className="w-3 h-3"/>} Tải
                                </button>
                            </div>
                        </div>

                         {/* HDC */}
                         <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full text-orange-600 border border-slate-100"><FileCheck className="w-6 h-6" /></div>
                                <span className="font-bold text-slate-700 text-sm">Hướng dẫn chấm</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={handlePreviewHDC} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"><Eye className="w-3 h-3"/> Xem</button>
                                <button onClick={handleDownloadHDC} disabled={isExportingHDC} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200">
                                   {isExportingHDC ? <Spinner /> : <Download className="w-3 h-3"/>} Tải
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. TEST SETS */}
                <div className="w-full max-w-5xl">
                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> Danh sách Đề thi (Chỉ câu hỏi)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {params?.testSets.map((set, idx) => (
                            <div key={set.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
                                <div className="mb-3">
                                    <div className="font-bold text-slate-800 text-sm">Bộ đề số {idx + 1}</div>
                                    <div className="text-xs text-slate-500 mt-1">Mã: {set.specificCodes}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handlePreviewSet(idx)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                                        <Eye className="w-3 h-3"/> Xem
                                    </button>
                                    <button onClick={() => handleDownloadSet(idx)} disabled={isExporting} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors">
                                        {isExporting ? <Spinner /> : <Download className="w-3 h-3"/>} Tải
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {previewData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600"/> {previewData.title}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => window.print()} className="p-2 hover:bg-slate-200 rounded text-slate-500"><Printer className="w-5 h-5"/></button>
                        <button onClick={() => setPreviewData(null)} className="p-2 hover:bg-red-100 hover:text-red-600 rounded text-slate-500 transition-colors"><X className="w-5 h-5"/></button>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white custom-scrollbar printable-content">
                      {previewData.type === 'markdown' && previewData.content && (
                          <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
                                  {previewData.content}
                              </ReactMarkdown>
                          </div>
                      )}
                      {previewData.type === 'matrix' && renderMatrixHTML()}
                      {previewData.type === 'spec' && renderSpecHTML()}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default ResultDisplay;
