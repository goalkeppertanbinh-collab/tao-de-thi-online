
import { TestParams } from "../types";

export const exportMatrixToExcel = async (params: TestParams) => {
  const exceljsModule = await import("exceljs");
  const ExcelJS = exceljsModule.default ?? exceljsModule;
  
  const fileSaverModule = await import("file-saver");
  const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ma Trận Đề Thi");

  // --- COLUMNS SETUP ---
  worksheet.columns = [
    { width: 5 },  // A: TT
    { width: 30 }, // B: Chủ đề
    { width: 30 }, // C: Nội dung
    { width: 5 }, { width: 5 }, { width: 5 }, // D,E,F: MC
    { width: 5 }, { width: 5 }, { width: 5 }, // G,H,I: TF
    { width: 5 }, { width: 5 }, { width: 5 }, // J,K,L: SA
    { width: 5 }, { width: 5 }, { width: 5 }, // M,N,O: Essay
    { width: 5 }, { width: 5 }, { width: 5 }, // P,Q,R: Total Breakdown
    { width: 10 }, // S: Grand Total
    { width: 10 }, // T: Ratio
  ];

  // --- STYLES ---
  const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  const headerStyle = { font: { name: 'Times New Roman', bold: true, size: 11 }, alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }, border: borderStyle };
  const dataStyle = { font: { name: 'Times New Roman', size: 11 }, alignment: { vertical: 'middle', wrapText: true }, border: borderStyle };
  const centerStyle = { ...dataStyle, alignment: { vertical: 'middle', horizontal: 'center' } };
  const boldCenterStyle = { ...centerStyle, font: { name: 'Times New Roman', bold: true, size: 11 } };

  // --- HEADERS ---
  worksheet.mergeCells('A1:A4'); worksheet.getCell('A1').value = "TT";
  worksheet.mergeCells('B1:B4'); worksheet.getCell('B1').value = "Chủ đề";
  worksheet.mergeCells('C1:C4'); worksheet.getCell('C1').value = "Nội dung/Đơn vị kiến thức";
  worksheet.mergeCells('D1:O1'); worksheet.getCell('D1').value = "Mức độ đánh giá";
  worksheet.mergeCells('P1:R2'); worksheet.getCell('P1').value = "Tổng";
  worksheet.mergeCells('S1:S4'); worksheet.getCell('S1').value = "Tổng số câu";
  worksheet.mergeCells('T1:T4'); worksheet.getCell('T1').value = "Tỉ lệ % điểm";
  worksheet.mergeCells('D2:L2'); worksheet.getCell('D2').value = "Trắc nghiệm khách quan";
  worksheet.mergeCells('M2:O2'); worksheet.getCell('M2').value = "Tự luận";
  worksheet.mergeCells('D3:F3'); worksheet.getCell('D3').value = "Nhiều lựa chọn";
  worksheet.mergeCells('G3:I3'); worksheet.getCell('G3').value = "Đúng - Sai";
  worksheet.mergeCells('J3:L3'); worksheet.getCell('J3').value = "Trả lời ngắn";
  worksheet.mergeCells('M3:O3'); worksheet.getCell('M3').value = "Tự luận";
  worksheet.getCell('P3').value = "Biết"; worksheet.getCell('Q3').value = "Hiểu"; worksheet.getCell('R3').value = "Vận dụng";
  worksheet.mergeCells('P3:P4'); worksheet.mergeCells('Q3:Q4'); worksheet.mergeCells('R3:R4');

  const levels = ["Biết", "Hiểu", "Vận dụng"];
  let colIdx = 4;
  for(let i=0; i<4; i++) { levels.forEach(l => { worksheet.getRow(4).getCell(colIdx).value = l; colIdx++; }); }

  [1,2,3,4].forEach(r => {
      worksheet.getRow(r).height = 25;
      worksheet.getRow(r).eachCell({ includeEmpty: true }, (cell, colNumber) => { if (colNumber <= 20) cell.style = headerStyle as any; });
  });

  // --- DATA ROWS ---
  let currentRow = 5;
  const COLS = { MC: { B: 4, H: 5, VD: 6 }, TF: { B: 7, H: 8, VD: 9 }, SA: { B: 10, H: 11, VD: 12 }, ES: { B: 13, H: 14, VD: 15 }, TOT: { B: 16, H: 17, VD: 18 }, GRAND: 19, PCT: 20 };
  const grandTotals = { mc: { nb: 0, th: 0, vd: 0 }, tf: { nb: 0, th: 0, vd: 0 }, sa: { nb: 0, th: 0, vd: 0 }, es: { nb: 0, th: 0, vd: 0 } };

  params.topics.forEach((topic, index) => {
      const m = topic.matrix;
      const row = worksheet.getRow(currentRow);
      row.getCell(1).value = index + 1; row.getCell(1).style = centerStyle as any;
      row.getCell(2).value = topic.parentName || topic.name; row.getCell(2).style = dataStyle as any;
      row.getCell(3).value = topic.name; row.getCell(3).style = dataStyle as any;

      const fill = (c: number, val: number) => { row.getCell(c).value = val > 0 ? val : ""; row.getCell(c).style = centerStyle as any; };

      fill(COLS.MC.B, m.multipleChoice.recognition); grandTotals.mc.nb += m.multipleChoice.recognition;
      fill(COLS.MC.H, m.multipleChoice.comprehension); grandTotals.mc.th += m.multipleChoice.comprehension;
      fill(COLS.MC.VD, m.multipleChoice.application); grandTotals.mc.vd += m.multipleChoice.application;

      fill(COLS.TF.B, m.trueFalse.recognition); grandTotals.tf.nb += m.trueFalse.recognition;
      fill(COLS.TF.H, m.trueFalse.comprehension); grandTotals.tf.th += m.trueFalse.comprehension;
      fill(COLS.TF.VD, m.trueFalse.application); grandTotals.tf.vd += m.trueFalse.application;

      fill(COLS.SA.B, m.shortAnswer.recognition); grandTotals.sa.nb += m.shortAnswer.recognition;
      fill(COLS.SA.H, m.shortAnswer.comprehension); grandTotals.sa.th += m.shortAnswer.comprehension;
      fill(COLS.SA.VD, m.shortAnswer.application); grandTotals.sa.vd += m.shortAnswer.application;

      fill(COLS.ES.B, m.essay.recognition); grandTotals.es.nb += m.essay.recognition;
      fill(COLS.ES.H, m.essay.comprehension); grandTotals.es.th += m.essay.comprehension;
      fill(COLS.ES.VD, m.essay.application); grandTotals.es.vd += m.essay.application;

      const rowNB = m.multipleChoice.recognition + m.trueFalse.recognition + m.shortAnswer.recognition + m.essay.recognition;
      const rowTH = m.multipleChoice.comprehension + m.trueFalse.comprehension + m.shortAnswer.comprehension + m.essay.comprehension;
      const rowVD = m.multipleChoice.application + m.trueFalse.application + m.shortAnswer.application + m.essay.application;
      
      fill(COLS.TOT.B, rowNB); fill(COLS.TOT.H, rowTH); fill(COLS.TOT.VD, rowVD);
      row.getCell(COLS.GRAND).value = rowNB + rowTH + rowVD; row.getCell(COLS.GRAND).style = boldCenterStyle as any;
      
      // Calculate Score based on Points Per Question
      const mcCount = m.multipleChoice.recognition + m.multipleChoice.comprehension + m.multipleChoice.application;
      const tfCount = m.trueFalse.recognition + m.trueFalse.comprehension + m.trueFalse.application;
      const saCount = m.shortAnswer.recognition + m.shortAnswer.comprehension + m.shortAnswer.application;
      const esCount = m.essay.recognition + m.essay.comprehension + m.essay.application;

      const topicScore = (mcCount * params.pointValues.multipleChoice) + 
                         (tfCount * params.pointValues.trueFalse) + 
                         (saCount * params.pointValues.shortAnswer) + 
                         (esCount * params.pointValues.essay);

      row.getCell(COLS.PCT).value = ((topicScore / 10) * 100).toFixed(0); row.getCell(COLS.PCT).style = centerStyle as any;

      currentRow++;
  });

  // SUM ROW
  const sumRow = worksheet.getRow(currentRow); worksheet.mergeCells(`A${currentRow}:C${currentRow}`); sumRow.getCell(1).value = "Tổng số câu"; sumRow.getCell(1).style = boldCenterStyle as any;
  const setSum = (c: number, val: number) => { sumRow.getCell(c).value = val; sumRow.getCell(c).style = boldCenterStyle as any; };
  setSum(COLS.MC.B, grandTotals.mc.nb); setSum(COLS.MC.H, grandTotals.mc.th); setSum(COLS.MC.VD, grandTotals.mc.vd);
  setSum(COLS.TF.B, grandTotals.tf.nb); setSum(COLS.TF.H, grandTotals.tf.th); setSum(COLS.TF.VD, grandTotals.tf.vd);
  setSum(COLS.SA.B, grandTotals.sa.nb); setSum(COLS.SA.H, grandTotals.sa.th); setSum(COLS.SA.VD, grandTotals.sa.vd);
  setSum(COLS.ES.B, grandTotals.es.nb); setSum(COLS.ES.H, grandTotals.es.th); setSum(COLS.ES.VD, grandTotals.es.vd);
  const totalNB = grandTotals.mc.nb + grandTotals.tf.nb + grandTotals.sa.nb + grandTotals.es.nb;
  const totalTH = grandTotals.mc.th + grandTotals.tf.th + grandTotals.sa.th + grandTotals.es.th;
  const totalVD = grandTotals.mc.vd + grandTotals.tf.vd + grandTotals.sa.vd + grandTotals.es.vd;
  setSum(COLS.TOT.B, totalNB); setSum(COLS.TOT.H, totalTH); setSum(COLS.TOT.VD, totalVD);
  const finalTotalQ = totalNB + totalTH + totalVD; setSum(COLS.GRAND, finalTotalQ); currentRow++;

  // SAVE
  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = params.testSets?.[0]?.fileName || "MaTran";
  saveAs(new Blob([buffer]), `${fileName}_MaTran.xlsx`);
};
