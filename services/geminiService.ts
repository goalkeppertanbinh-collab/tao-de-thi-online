
import { GoogleGenAI } from "@google/genai";
import { TestParams, Topic, LevelCounts } from "../types";

const generateSystemInstruction = () => {
  return `Bạn là một chuyên gia giáo dục Toán học Việt Nam, chuyên soạn đề kiểm tra cho học sinh Trung học cơ sở (THCS) theo Chương trình Giáo dục Phổ thông 2018.
Bám sát SGK "CHÂN TRỜI SÁNG TẠO".

CẤU TRÚC ĐỀ THI:
1. Phần I: Trắc nghiệm khách quan (Nhiều lựa chọn).
2. Phần II: Trắc nghiệm Đúng/Sai. BẮT BUỘC: Mỗi câu hỏi phải có chính xác 4 ý tiểu dẫn (a, b, c, d).
3. Phần III: Trắc nghiệm Trả lời ngắn.
4. Phần IV: Tự luận.

QUY ĐỊNH ĐỊNH DẠNG HIỂN THỊ (NGHIÊM NGẶT):
1. TIÊU ĐỀ CÂU HỎI TRONG ĐỀ THI:
   - Phải hiển thị ĐIỂM SỐ của câu đó, KHÔNG hiển thị mức độ (NB, TH, VD).
   - Định dạng: **Câu [N] ([Điểm] điểm):** [Nội dung câu hỏi]
   - Ví dụ: "Câu 1 (0,25 điểm): Tập hợp A gồm..." 
   - KHÔNG ĐƯỢC VIẾT: "Câu 1 (NB):" hay "Câu 1 (Nhận biết):".

2. BẢNG ĐÁP ÁN (Đặc biệt là phần Tự Luận):
   - TUYỆT ĐỐI KHÔNG sử dụng thẻ <br> hay <br/> trong Markdown Table.
   - Nếu nội dung dài hoặc có nhiều bước, hãy dùng dấu chấm phẩy (;) hoặc số thứ tự (1. 2.) trên cùng một dòng.
   - Ví dụ: "Bước 1: Tính Delta; Bước 2: Tìm nghiệm".

QUY TRÌNH TẠO ĐỀ (QUAN TRỌNG):
Khi người dùng yêu cầu tạo một Bộ đề gồm nhiều mã (Ví dụ: 801, 802):
1. Bạn phải viết ĐẦY ĐỦ nội dung đề thi cho mã 801.
2. Sau đó, viết ĐẦY ĐỦ nội dung đề thi cho mã 802 (với các câu hỏi trắc nghiệm đã được xáo trộn thứ tự/đáp án so với 801, nhưng Tự luận giữ nguyên).
3. Cuối cùng mới viết Bảng Đáp Án tổng hợp.
KHÔNG ĐƯỢC viết tắt kiểu "Mã 802 tương tự mã 801". Phải viết rõ ra để người dùng in ấn.

YÊU CẦU VỀ ĐỊNH DẠNG ĐÁP ÁN (BẮT BUỘC):
Với mỗi bộ đề, bạn phải tạo ra Bảng Đáp Án tổng hợp so sánh TẤT CẢ các mã đề (variants) được yêu cầu trong bộ đó.

Định dạng bảng Markdown CHÍNH XÁC như sau (Ví dụ 2 mã đề 801, 802):

### I. Trắc nghiệm:
| Câu | Mã Đề 801 | Mã Đề 802 | Điểm |
|---|---|---|---|
| 1 | B | C | 0,25 |
| 2 | A | A | 0,25 |

### II. Trắc nghiệm đúng sai:
| Câu | Mã Đề 801 | Mã Đề 802 | Điểm |
|---|---|---|---|
| 13 | a–Đ, b–S, c–Đ, d-S | a–S, b–Đ, c–Đ, d-S | 1,0 |

### III. Trả lời ngắn:
| Câu | Mã Đề 801 | Mã Đề 802 | Điểm |
|---|---|---|---|
| 15 | x^2-4 | 0 | 0,5 |
| 16 | 3x(x-2y) | xy/4 | 0,5 |

### IV. Tự luận:
(Tự luận KHÔNG tráo đổi nội dung giữa các mã đề trong cùng 1 bộ. Chỉ cần liệt kê đáp án/hướng dẫn chấm chung).
LƯU Ý: TUYỆT ĐỐI KHÔNG sử dụng thẻ <br>.
| Câu | Nội dung | Điểm |
|---|---|---|
| 19 | a) ... ; b) ... | 0,5 |

YÊU CẦU VỀ TRỘN ĐỀ (SHUFFLING):
- Nếu bật trộn: CHỈ trộn thứ tự câu và đáp án ở Phần I, II, III giữa các mã đề.
- TUYỆT ĐỐI KHÔNG TRỘN PHẦN IV (TỰ LUN). Câu hỏi tự luận phải giữ nguyên vị trí và nội dung cho mọi mã đề của bộ đó.

CẤU TRÚC OUTPUT ĐỂ TÁCH FILE:
## BỘ ĐỀ SỐ [N] (Các mã: [Danh sách mã] - [Tên File])

### ĐỀ KIỂM TRA MÃ [Mã 1]
... (Nội dung đầy đủ của mã 1) ...

---

### ĐỀ KIỂM TRA MÃ [Mã 2] (Nếu có)
... (Nội dung đầy đủ của mã 2 - Đã trộn trắc nghiệm) ...

---

### Đáp án và Hướng dẫn chấm (Bộ [N] - Mã: [Danh sách mã])
... (Các bảng đáp án so sánh đầy đủ các mã như mẫu trên) ...

[Lặp lại cho các Bộ đề khác...]

## NGÂN HÀNG CÂU HỎI
Lập bảng ngân hàng câu hỏi bằng cách **TRÍCH XUẤT NỘI DUNG TỪ MÃ ĐỀ ĐẦU TIÊN** của mỗi Bộ đề.
(Ví dụ: Bộ 1 có mã 601, 602 -> Lấy toàn bộ câu hỏi và đáp án của mã 601 đưa vào đây. Nếu có Bộ 2 mã 603, 604 -> Lấy tiếp câu hỏi của mã 603 đưa vào đây).
Bảng phải chứa đầy đủ câu hỏi của tất cả các phần (TN, Đ/S, TLN, TL).

| Câu | Mức độ | Nội dung câu hỏi | Đáp án | Thang điểm |
|---|---|---|---|---|
| 1 | NB | [Nội dung lấy từ Mã đề đầu tiên] | [Đáp án] | ... |
| 2 | TH | ... | ... | ... |
`;
};

const formatTopicMatrix = (topics: Topic[]) => {
  let matrixStr = "MA TRẬN ĐẶC TẢ CHI TIẾT:\n";
  const sumLevels = (l: LevelCounts) => l.recognition + l.comprehension + l.application;
  
  let globalTotals = {
    rec: 0, comp: 0, app: 0,
    mc: 0, tf: 0, sa: 0, es: 0
  };

  topics.forEach((t, index) => {
    const parent = t.parentName ? `(Chương: ${t.parentName})` : "";
    matrixStr += `- Chủ đề ${index + 1}: "${t.name}" ${parent}${t.description ? `\n    (Yêu cầu chi tiết: ${t.description})` : ""}\n`;
    
    const mcTotal = sumLevels(t.matrix.multipleChoice);
    if (mcTotal > 0) {
      matrixStr += `  + Trắc nghiệm: ${mcTotal} câu (${t.matrix.multipleChoice.recognition} NB, ${t.matrix.multipleChoice.comprehension} TH, ${t.matrix.multipleChoice.application} VD)\n`;
      globalTotals.mc += mcTotal;
    }

    const tfTotal = sumLevels(t.matrix.trueFalse);
    if (tfTotal > 0) {
      matrixStr += `  + Đúng/Sai: ${tfTotal} câu (${t.matrix.trueFalse.recognition} NB, ${t.matrix.trueFalse.comprehension} TH, ${t.matrix.trueFalse.application} VD)\n`;
      globalTotals.tf += tfTotal;
    }

    const saTotal = sumLevels(t.matrix.shortAnswer);
    if (saTotal > 0) {
      matrixStr += `  + Trả lời ngắn: ${saTotal} câu (${t.matrix.shortAnswer.recognition} NB, ${t.matrix.shortAnswer.comprehension} TH, ${t.matrix.shortAnswer.application} VD)\n`;
      globalTotals.sa += saTotal;
    }

    const esTotal = sumLevels(t.matrix.essay);
    if (esTotal > 0) {
      matrixStr += `  + Tự luận: ${esTotal} câu (${t.matrix.essay.recognition} NB, ${t.matrix.essay.comprehension} TH, ${t.matrix.essay.application} VD)\n`;
      globalTotals.es += esTotal;
    }
  });

  return { matrixStr, globalTotals };
};

const generateUserPrompt = (params: TestParams) => {
  const { grade, duration, topics, testSets, preventDuplicates, matrixFileContent, pointValues, additionalRequest } = params;
  
  let setInstructions = `YÊU CẦU VỀ CÁC BỘ ĐỀ (TỔNG CỘNG ${testSets.length} BỘ):\n`;
  
  if (preventDuplicates && testSets.length > 1) {
      setInstructions += `QUAN TRỌNG: Các câu hỏi giữa các Bộ đề khác nhau KHÔNG ĐƯỢC TRÙNG NHAU (Bộ 1 phải khác Bộ 2). Tạo nội dung riêng biệt.\n`;
  }

  testSets.forEach((set, index) => {
    const variantStr = set.specificCodes || `${(index+1)*100+1}`;

    setInstructions += `
---------------------------------------------------
BỘ ĐỀ SỐ ${index + 1}:
- Các mã đề (Variants) cần tạo: ${variantStr}.
- Chế độ trộn: ${set.enableShuffle ? "BẬT (Trộn thứ tự câu/đáp án Phần I, II, III giữa các mã)" : "TẮT"}.
- LƯU Ý: Phần IV (Tự luận) KHÔNG TRỘN (Nội dung giống hệt nhau cho mọi mã).
- OUTPUT YÊU CẦU (BẮT BUỘC):
  1. VIẾT ĐẦY ĐỦ ĐỀ THI CHO TỪNG MÃ ĐỀ TRONG DANH SÁCH: ${variantStr}.
     (Ví dụ: Nếu danh sách là "801, 802", bạn phải viết toàn bộ đề 801, sau đó viết toàn bộ đề 802).
  2. Cuối cùng mới là Bảng Đáp Án so sánh cho TẤT CẢ các mã: ${variantStr}.
---------------------------------------------------
`;
  });

  let contentInstruction = "";
  if (matrixFileContent) {
    contentInstruction = `NỘI DUNG MA TRẬN / TÀI LIỆU CUNG CẤP:\n${matrixFileContent}`;
  } else {
    const { matrixStr, globalTotals } = formatTopicMatrix(topics);
    contentInstruction = `MA TRẬN:\n${matrixStr}\n
QUY ĐỊNH CẤU TRÚC VÀ ĐIỂM SỐ:
- Tổng số câu: ${globalTotals.mc} TN, ${globalTotals.tf} Đ/S, ${globalTotals.sa} TLN, ${globalTotals.es} TL.
- Điểm chi tiết từng câu (Thang điểm 10):
  + Trắc nghiệm (I): ${pointValues.multipleChoice} điểm/câu.
  + Đúng/Sai (II): ${pointValues.trueFalse} điểm/câu (tối đa cho 4 ý đúng).
  + Trả lời ngắn (III): ${pointValues.shortAnswer} điểm/câu.
  + Tự luận (IV): ${pointValues.essay} điểm/câu.`;
  }

  let finalPrompt = `Hãy soạn đề kiểm tra Toán ${grade} (${duration}) bám sát SGK CHÂN TRỜI SÁNG TẠO.

${setInstructions}

${contentInstruction}

${additionalRequest ? `YÊU CẦU THÊM: "${additionalRequest}"` : ""}
`;

  return finalPrompt;
};

export const generateMathTest = async (params: TestParams, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) throw new Error("API Key chưa được cung cấp.");
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelId = "gemini-2.5-flash"; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: generateUserPrompt(params),
      config: {
        systemInstruction: generateSystemInstruction(),
        temperature: 0.9, 
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error instanceof Error ? error : new Error("Lỗi không xác định từ Gemini.");
  }
};

export const generateTikZCode = async (description: string, apiKey: string): Promise<string> => {
    try {
        if (!apiKey) throw new Error("API Key chưa được cung cấp.");
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const modelId = "gemini-2.5-flash";

        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Viết mã LaTeX TikZ để vẽ hình học sau: "${description}".
            Chỉ trả về mã nằm trong block code \`\`\`latex ... \`\`\`. 
            Giữ mã đơn giản, đẹp, dễ render. Không giải thích thêm.`,
        });
        
        const text = response.text || "";
        const match = text.match(/```latex([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
        return match ? match[1].trim() : text;
    } catch (error) {
        console.error("TikZ Error:", error);
        return "Lỗi tạo mã TikZ.";
    }
}
