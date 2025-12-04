
import { TestParams } from "../types";

export const exportToWord = async (content: string, filename: string = "De_Kiem_Tra.docx", docTitle: string = "ĐỀ KIỂM TRA TOÁN (THCS)") => {
  const docx = await import("docx");
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;
  
  const fileSaverModule = await import("file-saver");
  const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;

  const parseTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return new TextRun({
          text: part.slice(2, -2),
          bold: true,
          font: "Times New Roman",
          size: 24,
        });
      }
      return new TextRun({
        text: part,
        font: "Times New Roman",
        size: 24,
      });
    });
  };

  const lines = content.split("\n");
  const docChildren: any[] = [];

  docChildren.push(
    new Paragraph({
      text: docTitle,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      run: { font: "Times New Roman", bold: true, size: 32 }
    })
  );

  let inTable = false;
  let tableRows: any[] = []; 

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
        if (inTable) {
            if (tableRows.length > 0) {
                docChildren.push(new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }));
            }
            inTable = false;
            tableRows = [];
        }
        docChildren.push(new Paragraph({}));
        continue;
    }

    if (line.startsWith("# ")) {
      docChildren.push(new Paragraph({
        text: line.replace("# ", ""),
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        run: { font: "Times New Roman", bold: true, size: 28, color: "000000" }
      }));
      continue;
    }
    if (line.startsWith("## ")) {
      docChildren.push(new Paragraph({
        text: line.replace("## ", ""),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        run: { font: "Times New Roman", bold: true, size: 26, color: "000000" }
      }));
      continue;
    }
    if (line.startsWith("### ")) {
      docChildren.push(new Paragraph({
        text: line.replace("### ", ""),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
        run: { font: "Times New Roman", bold: true, size: 24, color: "000000" }
      }));
      continue;
    }

    if (line.startsWith("|")) {
      const cells = line.split("|").filter((c, idx, arr) => {
          if (idx === 0 && c === "") return false;
          if (idx === arr.length - 1 && c === "") return false;
          return true;
      }).map(c => c.trim());

      if (line.includes("---")) continue;

      inTable = true;

      const tableCells = cells.map(cellText => new TableCell({
        children: [new Paragraph({ children: parseTextWithBold(cellText), alignment: AlignmentType.CENTER })], 
        width: { size: 100 / cells.length, type: WidthType.PERCENTAGE },
        verticalAlign: AlignmentType.CENTER,
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        }
      }));

      tableRows.push(new TableRow({ children: tableCells }));
      continue;
    } else {
        if (inTable) {
             if (tableRows.length > 0) {
                docChildren.push(new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }));
            }
            inTable = false;
            tableRows = [];
        }
    }

    docChildren.push(new Paragraph({
      children: parseTextWithBold(line),
      spacing: { after: 120 },
      alignment: AlignmentType.JUSTIFIED
    }));
  }

  if (inTable && tableRows.length > 0) {
      docChildren.push(new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};

// --- HELPER FOR COMPLEX TABLES ---
const createHeaderCell = (docx: any, text: string, rowSpan: number = 1, colSpan: number = 1, widthPercent: number = 0) => {
  const { TableCell, Paragraph, TextRun, AlignmentType, VerticalAlign, WidthType, BorderStyle } = docx;
  return new TableCell({
    children: [new Paragraph({ 
        children: [new TextRun({ text, bold: true, font: "Times New Roman", size: 22 })], 
        alignment: AlignmentType.CENTER 
    })],
    verticalAlign: VerticalAlign.CENTER,
    rowSpan: rowSpan,
    columnSpan: colSpan,
    width: widthPercent > 0 ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined,
    borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
    }
  });
};

const createDataCell = (docx: any, text: string | number, align: any = null, bold: boolean = false, colSpan: number = 1) => {
    const { TableCell, Paragraph, TextRun, AlignmentType, VerticalAlign, BorderStyle } = docx;
    return new TableCell({
      children: [new Paragraph({ 
          children: [new TextRun({ text: String(text), bold: bold, font: "Times New Roman", size: 22 })], 
          alignment: align || AlignmentType.CENTER 
      })],
      verticalAlign: VerticalAlign.CENTER,
      columnSpan: colSpan,
      borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
      }
    });
};

// --- MATRIX EXPORT (LANDSCAPE) ---
export const exportMatrixDocx = async (params: TestParams) => {
    const docx = await import("docx");
    const { Document, Packer, Table, TableRow, AlignmentType, HeadingLevel, Paragraph, WidthType, PageOrientation } = docx;
    const fileSaverModule = await import("file-saver");
    const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;

    // Row 1: Headers
    const hRow1 = new TableRow({
        children: [
            createHeaderCell(docx, "TT", 4, 1, 3),
            createHeaderCell(docx, "Chủ đề/Chương", 4, 1, 15),
            createHeaderCell(docx, "Nội dung/ đơn vị kiến thức", 4, 1, 20),
            createHeaderCell(docx, "Mức độ đánh giá", 1, 12),
            createHeaderCell(docx, "Tổng", 3, 3), 
            createHeaderCell(docx, "Tỉ lệ %", 4, 1, 4),
        ]
    });

    const hRow2 = new TableRow({
        children: [
            createHeaderCell(docx, "Trắc nghiệm khách quan", 1, 9),
            createHeaderCell(docx, "Tự luận", 1, 3),
        ]
    });

    const hRow3 = new TableRow({
        children: [
            createHeaderCell(docx, "Nhiều lựa chọn", 1, 3),
            createHeaderCell(docx, "“Đúng – Sai”", 1, 3),
            createHeaderCell(docx, "Trả lời ngắn", 1, 3),
            createHeaderCell(docx, "Tự luận", 1, 3),
        ]
    });

    const hRow4 = new TableRow({
        children: [
            ...Array(4).fill(null).flatMap(() => [
                createHeaderCell(docx, "Biết", 1, 1),
                createHeaderCell(docx, "Hiểu", 1, 1),
                createHeaderCell(docx, "Vận dụng", 1, 1),
            ]),
            createHeaderCell(docx, "Biết", 1, 1),
            createHeaderCell(docx, "Hiểu", 1, 1),
            createHeaderCell(docx, "Vận dụng", 1, 1),
        ]
    });
    
    const rows = [hRow1, hRow2, hRow3, hRow4];

    // --- DATA ROWS ---
    let totalScore = 0;
    const grandTotals = {
        mc: { b: 0, h: 0, vd: 0 },
        tf: { b: 0, h: 0, vd: 0 },
        sa: { b: 0, h: 0, vd: 0 },
        es: { b: 0, h: 0, vd: 0 },
        all: { b: 0, h: 0, vd: 0 }
    };

    params.topics.forEach((t, idx) => {
        const m = t.matrix;
        const sumType = (l: any) => l.recognition + l.comprehension + l.application;
        const topicScore = (sumType(m.multipleChoice) * params.pointValues.multipleChoice) +
                           (sumType(m.trueFalse) * params.pointValues.trueFalse) +
                           (sumType(m.shortAnswer) * params.pointValues.shortAnswer) +
                           (sumType(m.essay) * params.pointValues.essay);
        totalScore += topicScore;

        const rowTotalNB = m.multipleChoice.recognition + m.trueFalse.recognition + m.shortAnswer.recognition + m.essay.recognition;
        const rowTotalTH = m.multipleChoice.comprehension + m.trueFalse.comprehension + m.shortAnswer.comprehension + m.essay.comprehension;
        const rowTotalVD = m.multipleChoice.application + m.trueFalse.application + m.shortAnswer.application + m.essay.application;

        grandTotals.mc.b += m.multipleChoice.recognition; grandTotals.mc.h += m.multipleChoice.comprehension; grandTotals.mc.vd += m.multipleChoice.application;
        grandTotals.tf.b += m.trueFalse.recognition; grandTotals.tf.h += m.trueFalse.comprehension; grandTotals.tf.vd += m.trueFalse.application;
        grandTotals.sa.b += m.shortAnswer.recognition; grandTotals.sa.h += m.shortAnswer.comprehension; grandTotals.sa.vd += m.shortAnswer.application;
        grandTotals.es.b += m.essay.recognition; grandTotals.es.h += m.essay.comprehension; grandTotals.es.vd += m.essay.application;
        grandTotals.all.b += rowTotalNB; grandTotals.all.h += rowTotalTH; grandTotals.all.vd += rowTotalVD;

        rows.push(new TableRow({
            children: [
                createDataCell(docx, idx + 1),
                createDataCell(docx, t.parentName || t.name, AlignmentType.LEFT), // Use Parent Name (Major Topic)
                createDataCell(docx, t.name, AlignmentType.LEFT), // Use Name (Content)
                createDataCell(docx, m.multipleChoice.recognition || ""),
                createDataCell(docx, m.multipleChoice.comprehension || ""),
                createDataCell(docx, m.multipleChoice.application || ""),
                createDataCell(docx, m.trueFalse.recognition || ""),
                createDataCell(docx, m.trueFalse.comprehension || ""),
                createDataCell(docx, m.trueFalse.application || ""),
                createDataCell(docx, m.shortAnswer.recognition || ""),
                createDataCell(docx, m.shortAnswer.comprehension || ""),
                createDataCell(docx, m.shortAnswer.application || ""),
                createDataCell(docx, m.essay.recognition || ""),
                createDataCell(docx, m.essay.comprehension || ""),
                createDataCell(docx, m.essay.application || ""),
                createDataCell(docx, rowTotalNB || "", null, true),
                createDataCell(docx, rowTotalTH || "", null, true),
                createDataCell(docx, rowTotalVD || "", null, true),
                createDataCell(docx, ((topicScore / 10) * 100).toFixed(0), null, true),
            ]
        }));
    });

    // Summary Rows
    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Tổng số câu", 1, 3),
             ...[
                 grandTotals.mc.b, grandTotals.mc.h, grandTotals.mc.vd,
                 grandTotals.tf.b, grandTotals.tf.h, grandTotals.tf.vd,
                 grandTotals.sa.b, grandTotals.sa.h, grandTotals.sa.vd,
                 grandTotals.es.b, grandTotals.es.h, grandTotals.es.vd,
             ].map(v => createDataCell(docx, v || "", null, true)),
             createDataCell(docx, grandTotals.all.b, null, true),
             createDataCell(docx, grandTotals.all.h, null, true),
             createDataCell(docx, grandTotals.all.vd, null, true),
             createDataCell(docx, grandTotals.all.b + grandTotals.all.h + grandTotals.all.vd, null, true),
        ]
    }));

    const scoreMC = (grandTotals.mc.b + grandTotals.mc.h + grandTotals.mc.vd) * params.pointValues.multipleChoice;
    const scoreTF = (grandTotals.tf.b + grandTotals.tf.h + grandTotals.tf.vd) * params.pointValues.trueFalse;
    const scoreSA = (grandTotals.sa.b + grandTotals.sa.h + grandTotals.sa.vd) * params.pointValues.shortAnswer;
    const scoreES = (grandTotals.es.b + grandTotals.es.h + grandTotals.es.vd) * params.pointValues.essay;

    const scoreB = (grandTotals.mc.b * params.pointValues.multipleChoice) + (grandTotals.tf.b * params.pointValues.trueFalse) + (grandTotals.sa.b * params.pointValues.shortAnswer) + (grandTotals.es.b * params.pointValues.essay);
    const scoreH = (grandTotals.mc.h * params.pointValues.multipleChoice) + (grandTotals.tf.h * params.pointValues.trueFalse) + (grandTotals.sa.h * params.pointValues.shortAnswer) + (grandTotals.es.h * params.pointValues.essay);
    const scoreVD = (grandTotals.mc.vd * params.pointValues.multipleChoice) + (grandTotals.tf.vd * params.pointValues.trueFalse) + (grandTotals.sa.vd * params.pointValues.shortAnswer) + (grandTotals.es.vd * params.pointValues.essay);
    const finalScore = scoreMC + scoreTF + scoreSA + scoreES;

    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Tổng số điểm", 1, 3),
            createDataCell(docx, scoreMC.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreTF.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreSA.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreES.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreB.toFixed(1).replace('.', ','), null, true),
            createDataCell(docx, scoreH.toFixed(1).replace('.', ','), null, true),
            createDataCell(docx, scoreVD.toFixed(1).replace('.', ','), null, true),
            createDataCell(docx, finalScore.toFixed(0), null, true),
        ]
    }));

    const fmtPct = (val: number, total: number) => total > 0 ? ((val/total)*100).toFixed(0) : "0";
    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Tỉ lệ %", 1, 3),
            createDataCell(docx, fmtPct(scoreMC, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreTF, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreSA, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreES, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreB, finalScore), null, true),
            createDataCell(docx, fmtPct(scoreH, finalScore), null, true),
            createDataCell(docx, fmtPct(scoreVD, finalScore), null, true),
            createDataCell(docx, "100", null, true),
        ]
    }));

    const doc = new Document({
        sections: [{
            properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
            children: [
                new Paragraph({ text: "BẢNG MA TRẬN ĐỀ KIỂM TRA", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
                new Table({ rows: rows, width: { size: 100, type: WidthType.PERCENTAGE } })
            ]
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${params.testSets[0]?.fileName || 'De_Thi'}_Ma_Tran.docx`);
};

// --- SPECIFICATION EXPORT (LANDSCAPE, DETAILED) ---
export const exportSpecDocx = async (params: TestParams) => {
    const docx = await import("docx");
    const { Document, Packer, Table, TableRow, TableCell, AlignmentType, HeadingLevel, Paragraph, WidthType, PageOrientation, TextRun, BorderStyle, VerticalAlign } = docx;
    const fileSaverModule = await import("file-saver");
    const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;

    // Helper to create the detailed cell (e.g., "C1\nNLMH")
    const createSpecCell = (count: number, startIdx: number, competency: string = "NLMH") => {
       if (count <= 0) return createDataCell(docx, "");
       
       const endIdx = startIdx + count - 1;
       const qRange = count === 1 ? `C${startIdx}` : `C${startIdx}-C${endIdx}`;
       
       return new TableCell({
            children: [
                new Paragraph({ children: [new TextRun({ text: qRange, bold: true, size: 22, font: "Times New Roman" })], alignment: AlignmentType.CENTER }),
                new Paragraph({ children: [new TextRun({ text: competency, size: 20, font: "Times New Roman" })], alignment: AlignmentType.CENTER })
            ],
            verticalAlign: VerticalAlign.CENTER,
            borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
            }
       });
    };

    // Header Structure
    const hRow1 = new TableRow({
        children: [
            createHeaderCell(docx, "TT", 4, 1, 5),
            createHeaderCell(docx, "Chủ đề/Chương", 4, 1, 15),
            createHeaderCell(docx, "Nội dung/ đơn vị kiến thức", 4, 1, 20),
            createHeaderCell(docx, "Yêu cầu cần đạt", 4, 1, 25),
            createHeaderCell(docx, "Số câu hỏi ở các mức độ đánh giá", 1, 12),
        ]
    });
    const hRow2 = new TableRow({
        children: [
            createHeaderCell(docx, "Trắc nghiệm khách quan", 1, 9),
            createHeaderCell(docx, "Tự luận", 1, 3),
        ]
    });
    const hRow3 = new TableRow({
        children: [
            createHeaderCell(docx, "Nhiều lựa chọn", 1, 3),
            createHeaderCell(docx, "“Đúng – Sai”", 1, 3),
            createHeaderCell(docx, "Trả lời ngắn", 1, 3),
            createHeaderCell(docx, "Tự luận", 1, 3), 
        ]
    });
    const hRow4 = new TableRow({
        children: Array(4).fill(null).flatMap(() => [
            createHeaderCell(docx, "Biết", 1, 1),
            createHeaderCell(docx, "Hiểu", 1, 1),
            createHeaderCell(docx, "Vận dụng", 1, 1),
        ])
    });

    const rows = [hRow1, hRow2, hRow3, hRow4];
    
    let globalQ = 1;
    let totalMC = 0, totalTF = 0, totalSA = 0, totalEssay = 0;

    params.topics.forEach((t, idx) => {
        const m = t.matrix;
        
        const sumType = (l: any) => l.recognition + l.comprehension + l.application;
        totalMC += sumType(m.multipleChoice);
        totalTF += sumType(m.trueFalse);
        totalSA += sumType(m.shortAnswer);
        totalEssay += sumType(m.essay);

        const cells = [];
        cells.push(createDataCell(docx, idx + 1));
        cells.push(createDataCell(docx, t.parentName || t.name, AlignmentType.LEFT)); // Parent Name
        cells.push(createDataCell(docx, t.name, AlignmentType.LEFT)); // Name
        cells.push(createDataCell(docx, t.description || "Nắm vững kiến thức...", AlignmentType.LEFT));

        // MC
        cells.push(createSpecCell(m.multipleChoice.recognition, globalQ, "TDLL")); globalQ += m.multipleChoice.recognition;
        cells.push(createSpecCell(m.multipleChoice.comprehension, globalQ, "MHH")); globalQ += m.multipleChoice.comprehension;
        cells.push(createSpecCell(m.multipleChoice.application, globalQ, "GQVĐ")); globalQ += m.multipleChoice.application;
        
        // TF
        cells.push(createSpecCell(m.trueFalse.recognition, globalQ, "TDLL")); globalQ += m.trueFalse.recognition;
        cells.push(createSpecCell(m.trueFalse.comprehension, globalQ, "GTTH")); globalQ += m.trueFalse.comprehension;
        cells.push(createSpecCell(m.trueFalse.application, globalQ, "GQVĐ")); globalQ += m.trueFalse.application;
        
        // SA
        cells.push(createSpecCell(m.shortAnswer.recognition, globalQ, "TDLL")); globalQ += m.shortAnswer.recognition;
        cells.push(createSpecCell(m.shortAnswer.comprehension, globalQ, "MHH")); globalQ += m.shortAnswer.comprehension;
        cells.push(createSpecCell(m.shortAnswer.application, globalQ, "GQVĐ")); globalQ += m.shortAnswer.application;
        
        // Essay
        cells.push(createSpecCell(m.essay.recognition, globalQ, "TDLL")); globalQ += m.essay.recognition;
        cells.push(createSpecCell(m.essay.comprehension, globalQ, "GTTH")); globalQ += m.essay.comprehension;
        cells.push(createSpecCell(m.essay.application, globalQ, "GQVĐ")); globalQ += m.essay.application;

        rows.push(new TableRow({ children: cells }));
    });

    // --- SUMMARY ROWS (Total Questions, Score, Percentage) ---
    // Calculate Scores based on points
    const scoreMC = totalMC * params.pointValues.multipleChoice;
    const scoreTF = totalTF * params.pointValues.trueFalse; 
    const scoreSA = totalSA * params.pointValues.shortAnswer;
    const scoreEssay = totalEssay * params.pointValues.essay;
    const finalScore = scoreMC + scoreTF + scoreSA + scoreEssay;

    // 1. Total Questions
    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Tổng số câu", 1, 4),
            createDataCell(docx, totalMC, null, true, 3), // Merged MC cols
            createDataCell(docx, totalTF, null, true, 3), // Merged TF cols
            createDataCell(docx, totalSA, null, true, 3), // Merged SA cols
            createDataCell(docx, totalEssay, null, true, 3), // Merged Essay cols
        ]
    }));

    // 2. Total Score
    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Tổng số điểm", 1, 4),
            createDataCell(docx, scoreMC.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreTF.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreSA.toFixed(1).replace('.', ','), null, true, 3),
            createDataCell(docx, scoreEssay.toFixed(1).replace('.', ','), null, true, 3),
        ]
    }));

    // 3. Percentage
    const fmtPct = (val: number, total: number) => total > 0 ? ((val/total)*100).toFixed(0) : "0";
    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Tỉ lệ %", 1, 4),
            createDataCell(docx, fmtPct(scoreMC, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreTF, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreSA, finalScore), null, true, 3),
            createDataCell(docx, fmtPct(scoreEssay, finalScore), null, true, 3),
        ]
    }));

    const doc = new Document({
        sections: [{
            properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
            children: [
                new Paragraph({ text: "BẢNG ĐẶC TẢ ĐỀ KIỂM TRA", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
                new Table({ rows: rows, width: { size: 100, type: WidthType.PERCENTAGE } })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${params.testSets[0]?.fileName || 'De_Thi'}_Dac_Ta.docx`);
};

// --- QUESTION BANK EXPORT (LANDSCAPE, MERGED TOPICS, COMBINED LEVEL) ---
export const exportBankDocx = async (result: string, params: TestParams) => {
    const docx = await import("docx");
    const { Document, Packer, Table, TableRow, TableCell, AlignmentType, HeadingLevel, Paragraph, WidthType, PageOrientation, TextRun, BorderStyle, VerticalAlign } = docx;
    const fileSaverModule = await import("file-saver");
    const saveAs = fileSaverModule.saveAs || (fileSaverModule as any).default;

    // 1. IMPROVED PARSING STRATEGY
    // Look for the "NGÂN HÀNG CÂU HỎI" section using a more robust regex
    const headerRegex = /(?:^|\n)#{1,3}\s*NGÂN\s+HÀNG\s+CÂU\s+HỎI/i;
    const parts = result.split(headerRegex);
    
    // Take the last part if found, assuming the bank is at the end
    let bankSection = parts.length > 1 ? parts[parts.length - 1] : null;

    // Fallback: If explicit header missing, look for the table structure (Header row)
    if (!bankSection) {
        // Look for typical headers in the bank table (Mức độ, Nội dung, Đáp án)
        const tableHeaderRegex = /\|\s*Câu\s*\|\s*Mức độ\s*\|\s*Nội dung/i;
        const match = result.match(tableHeaderRegex);
        if (match && match.index !== undefined) {
             bankSection = result.substring(match.index);
        }
    }

    if (!bankSection) { 
        alert("Không tìm thấy dữ liệu ngân hàng câu hỏi. Hãy kiểm tra kết quả hiển thị xem có phần 'NGÂN HÀNG CÂU HỎI' không."); 
        return; 
    }

    const lines = bankSection.split("\n").filter(line => line.trim().startsWith("|") && !line.includes("---"));
    const dataRows = lines.slice(1); // Skip header row
    
    // Parse raw data: [QuestionNo, Level, Content, Answer, Score]
    const parsedQuestions = dataRows.map(line => 
        line.split("|").filter((c, i, arr) => i !== 0 && i !== arr.length - 1).map(c => c.trim())
    );

    const rows: any[] = [];
    
    // Header
    rows.push(new TableRow({
        children: [
            createHeaderCell(docx, "Chủ đề", 1, 1, 15),
            createHeaderCell(docx, "Câu / Mức độ", 1, 1, 10),
            createHeaderCell(docx, "Nội dung câu hỏi", 1, 1, 45),
            createHeaderCell(docx, "Đáp án", 1, 1, 15),
            createHeaderCell(docx, "Thang điểm", 1, 1, 15),
        ]
    }));

    let currentQIdx = 0;

    // 2. Iterate Topics and assign questions
    params.topics.forEach(t => {
        const sumType = (l: any) => l.recognition + l.comprehension + l.application;
        const totalQ = sumType(t.matrix.multipleChoice) + sumType(t.matrix.trueFalse) + sumType(t.matrix.shortAnswer) + sumType(t.matrix.essay);

        if (totalQ === 0) return;

        // Get the slice of questions for this topic
        const topicQuestions = parsedQuestions.slice(currentQIdx, currentQIdx + totalQ);
        currentQIdx += totalQ;

        topicQuestions.forEach((q, idx) => {
            const cells = [];
            
            // Col 1: Topic (Merged for first row of topic, using Parent Name if available)
            if (idx === 0) {
                cells.push(new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: t.parentName || t.name, bold: true, font: "Times New Roman", size: 22 })], alignment: AlignmentType.CENTER })],
                    verticalAlign: VerticalAlign.CENTER,
                    rowSpan: topicQuestions.length,
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } }
                }));
            }

            // Col 2: Combined "1NB"
            const qNum = q[0] || "";
            const qLevel = q[1] || "";
            const combined = `${qNum}${qLevel}`;
            cells.push(createDataCell(docx, combined));

            // Col 3: Content (Left align)
            cells.push(createDataCell(docx, q[2] || "", AlignmentType.LEFT));

            // Col 4: Answer
            cells.push(createDataCell(docx, q[3] || ""));

            // Col 5: Score
            cells.push(createDataCell(docx, q[4] || ""));

            rows.push(new TableRow({ children: cells }));
        });
    });

    // Handle leftover questions
    if (currentQIdx < parsedQuestions.length) {
        const leftovers = parsedQuestions.slice(currentQIdx);
        leftovers.forEach((q, idx) => {
             const cells = [];
             if (idx === 0) {
                 cells.push(createDataCell(docx, "Khác", null, true, 1)); 
             } else {
                 cells.push(createDataCell(docx, "")); 
             }
             rows.push(new TableRow({
                 children: [
                     createDataCell(docx, "Khác"),
                     createDataCell(docx, `${q[0]}${q[1]}`),
                     createDataCell(docx, q[2] || "", AlignmentType.LEFT),
                     createDataCell(docx, q[3] || ""),
                     createDataCell(docx, q[4] || ""),
                 ]
             }));
        });
    }

    const doc = new Document({
        sections: [{
            properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
            children: [
                new Paragraph({ text: "NGÂN HÀNG CÂU HỎI", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
                new Table({ rows: rows, width: { size: 100, type: WidthType.PERCENTAGE } })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${params.testSets[0]?.fileName || 'Ngan_Hang'}_Cau_Hoi.docx`);
};
