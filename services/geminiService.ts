
import { GoogleGenAI } from "@google/genai";
import { TestParams, Topic, LevelCounts } from "../types";
import { CURRICULUM_DATA } from "../data/curriculumData";

const generateSystemInstruction = () => {
  return `Bạn là một chuyên gia giáo dục Toán học Việt Nam, chuyên soạn đề kiểm tra cho học sinh Trung học cơ sở (THCS) theo Chương trình Giáo dục Phổ thông 2018.
Bám sát SGK "CHÂN TRỜI SÁNG TẠO".

CẤU TRÚC ĐỀ THI (BẮT BUỘC DÙNG ĐÚNG ĐỊNH DẠNG TIÊU ĐỀ SAU):

I. Trắc Nghiệm: (Tổng điểm phần trắc nghiệm)
   Phần 1: ([Điểm] điểm) Câu trắc nghiệm nhiều phương án lựa chọn
   Phần 2: ([Điểm] điểm) Câu trắc nghiệm đúng sai. BẮT BUỘC: Mỗi câu hỏi phải có chính xác 4 ý tiểu dẫn (a, b, c, d).
   Phần 3: ([Điểm] điểm) Câu trắc nghiệm trả lời ngắn
II. Tự Luận: ([Điểm] điểm)

QUY ĐỊNH VỀ ĐỊNH DẠNG TOÁN HỌC (LATEX - CỰC KỲ QUAN TRỌNG):
Tuyệt đối không lạm dụng dấu $. Hãy phân biệt rõ ràng giữa "Văn bản" và "Toán học".
1. CHỈ sử dụng dấu $ cho: Biến số ($x, y$), Công thức ($y=ax+b$), Số đo có đơn vị ($90^\\circ$).
2. KHÔNG sử dụng dấu $ cho văn bản tiếng Việt hoặc số đếm bài (Câu 1).
3. LỖI CẦN TRÁNH: Dùng $\\sqrt{x}$, $\\frac{a}{b}$, $\\Delta ABC$, $\\widehat{A}$, $90^\\circ$ (không dùng $90^o$).

QUY ĐỊNH ĐỊNH DẠNG HIỂN THỊ CÂU HỎI:
- Tiêu đề câu hỏi phải có điểm số: **Câu [N] ([Điểm] điểm):** [Nội dung]

---

QUY ĐỊNH VỀ "ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM" (QUAN TRỌNG - TIÊU ĐỀ PHẢI GIỐNG HỆT ĐỀ THI):
Tuyệt đối KHÔNG chép lại đề bài vào phần này. Chỉ lập bảng kết quả.
Các mục lớn (I, II) và các Phần (1, 2, 3) phải giữ nguyên tên gọi như Đề thi.

A. MẪU BẢNG CHO PHẦN 1 (TRẮC NGHIỆM) VÀ PHẦN 3 (TRẢ LỜI NGẮN):
Tạo bảng có cột "Câu", các cột "Mã Đề ...", và cột "Điểm".
Ví dụ:
| Câu | Mã Đề [Code1] | Mã Đề [Code2] | Điểm |
|---|---|---|---|
| 1 | B | C | 0,25 |
| 2 | A | A | 0,25 |
| ... | ... | ... | ... |
*Lưu ý: Bảng đáp án phải tương ứng đúng với nội dung câu hỏi ở vị trí đó trong từng mã đề.*

B. MẪU BẢNG CHO PHẦN 2 (ĐÚNG/SAI):
Ghi rõ từng ý a, b, c, d là Đ hay S.
Ví dụ:
| Câu | Mã Đề [Code1] | Mã Đề [Code2] | Điểm |
|---|---|---|---|
| 13 | a-Đ, b-S, c-Đ, d-S | a-S, b-Đ, c-S, d-Đ | 1,0 |

C. MẪU BẢNG CHO PHẦN TỰ LUẬN - YÊU CẦU CHI TIẾT:
Cấu trúc bảng gồm 3 cột: | Câu | Nội dung | Điểm |
- Cột "Nội dung": Trình bày các bước giải chi tiết. Dùng thẻ <br> để xuống dòng giữa các bước.
- Cột "Điểm": Ghi điểm tổng cho câu đó (in đậm).
- Điểm thành phần: Ghi ngay trong cột nội dung, đặt cuối dòng của bước giải quan trọng. Ví dụ: (0,25).

!!! CẢNH BÁO QUAN TRỌNG ĐỂ TRÁNH VỠ KHUNG BẢNG !!!:
1. TUYỆT ĐỐI KHÔNG dùng ký tự gạch đứng '|' trong công thức toán (ví dụ trị tuyệt đối |x|).
   - Hãy thay thế bằng lệnh LaTeX: $\\lvert x \\rvert$ hoặc dùng ký tự escape '\\|'.
   - Nếu dùng '|' trần, bảng sẽ bị chia cắt sai cột.
2. TUYỆT ĐỐI KHÔNG dùng môi trường LaTeX phức tạp như \\begin{array}, \\begin{tabular}, \\begin{cases} bên trong ô bảng Markdown.
   - Thay vào đó, hãy dùng văn bản thường và dùng thẻ <br> để xuống dòng.
3. KHÔNG xuống dòng (Enter) trong một hàng của bảng. Toàn bộ nội dung của một câu tự luận phải nằm trên 1 dòng duy nhất trong file markdown.

VÍ DỤ MẪU TỰ LUẬN (Làm y hệt mẫu này):
| Câu | Nội dung | Điểm |
|---|---|---|
| 19 | a) Giải phương trình... <br> $2x - 3 = 0$ <br> $\\Leftrightarrow x = 1,5$ (0,5) <br> b) Tính toán... <br> Kết quả = 10 (0,5) | 1,0 |
| 20 | Xét tam giác ABC vuông tại A: <br> $BC^2 = AB^2 + AC^2$ (Định lí Pythagore) (0,25) <br> Thay số: $BC^2 = 6^2 + 8^2 = 100$ <br> $\\Rightarrow BC = 10 cm$ (0,25) | 0,5 |

---

QUY TRÌNH TẠO ĐỀ VÀ TRỘN ĐỀ:
1. Soạn thảo Mã đề Gốc trước.
2. Tạo các Mã đề Trộn dựa trên Mã Gốc:
   - Phần Tự luận (II): GIỮ NGUYÊN thứ tự và nội dung.
   - Phần Trắc nghiệm (I): BẮT BUỘC PHẢI THỰC HIỆN 2 VIỆC:
     + Việc 1: HOÁN VỊ THỨ TỰ CÂU HỎI (Ví dụ: Câu 1 ở đề gốc đảo xuống thành câu 5 ở đề trộn).
     + Việc 2: HOÁN VỊ THỨ TỰ ĐÁP ÁN (A, B, C, D) trong từng câu.

CẤU TRÚC OUTPUT (TUÂN THỦ NGHIÊM NGẶT TÊN TIÊU ĐỀ):
## BỘ ĐỀ SỐ [N] (Các mã: [Danh sách mã])

### ĐỀ KIỂM TRA MÃ [Mã Gốc]
...
---
### ĐỀ KIỂM TRA MÃ [Mã Trộn]
...
---
### ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (BỘ [N])

**I. Trắc Nghiệm**

**Phần 1: Câu trắc nghiệm nhiều phương án lựa chọn**
(Bảng đáp án so sánh các mã đề)

**Phần 2: Câu trắc nghiệm đúng sai**
(Bảng đáp án so sánh các mã đề)

**Phần 3: Câu trắc nghiệm trả lời ngắn**
(Bảng đáp án so sánh các mã đề)

**II. Tự Luận**
(Bảng 3 cột: Câu | Nội dung | Điểm - dùng thẻ <br> để ngắt dòng bước giải)

## NGÂN HÀNG CÂU HỎI
(Bảng tổng hợp từ Mã Gốc. Với câu trắc nghiệm, dùng <br> để ngắt dòng giữa câu hỏi và 4 đáp án A,B,C,D).
`;
};

const formatTopicMatrix = (topics: Topic[]) => {
  let matrixStr = "MA TRẬN ĐẶC TẢ CHI TIẾT:\n";
  const sumLevels = (l: LevelCounts) => (l?.recognition || 0) + (l?.comprehension || 0) + (l?.application || 0);
  
  let globalTotals = {
    rec: 0, comp: 0, app: 0,
    mc: 0, tf: 0, sa: 0, es: 0
  };

  topics.forEach((t, index) => {
    // Safety check for matrix structure
    if (!t.matrix || !t.matrix.multipleChoice) return;

    const parent = t.parentName ? `(Chương: ${t.parentName})` : "";
    matrixStr += `- Chủ đề ${index + 1}: "${t.name}" ${parent}${t.description ? `\n    (Yêu cầu chi tiết: ${t.description})` : ""}\n`;
    
    const mcTotal = sumLevels(t.matrix.multipleChoice);
    if (mcTotal > 0) {
      matrixStr += `  + Phần 1 (TN nhiều lựa chọn): ${mcTotal} câu (${t.matrix.multipleChoice.recognition || 0} NB, ${t.matrix.multipleChoice.comprehension || 0} TH, ${t.matrix.multipleChoice.application || 0} VD)\n`;
      globalTotals.mc += mcTotal;
    }

    const tfTotal = sumLevels(t.matrix.trueFalse);
    if (tfTotal > 0) {
      matrixStr += `  + Phần 2 (TN Đúng/Sai): ${tfTotal} câu (${t.matrix.trueFalse.recognition || 0} NB, ${t.matrix.trueFalse.comprehension || 0} TH, ${t.matrix.trueFalse.application || 0} VD)\n`;
      globalTotals.tf += tfTotal;
    }

    const saTotal = sumLevels(t.matrix.shortAnswer);
    if (saTotal > 0) {
      matrixStr += `  + Phần 3 (TN Trả lời ngắn): ${saTotal} câu (${t.matrix.shortAnswer.recognition || 0} NB, ${t.matrix.shortAnswer.comprehension || 0} TH, ${t.matrix.shortAnswer.application || 0} VD)\n`;
      globalTotals.sa += saTotal;
    }

    const esTotal = sumLevels(t.matrix.essay);
    if (esTotal > 0) {
      matrixStr += `  + Tự luận: ${esTotal} câu (${t.matrix.essay.recognition || 0} NB, ${t.matrix.essay.comprehension || 0} TH, ${t.matrix.essay.application || 0} VD)\n`;
      globalTotals.es += esTotal;
    }
  });

  return { matrixStr, globalTotals };
};

const generateUserPrompt = (params: TestParams) => {
  const { grade, duration, topics, testSets, preventDuplicates, matrixFileContent, pointValues, additionalRequest } = params;
  
  let setInstructions = `YÊU CẦU VỀ CÁC BỘ ĐỀ (TỔNG CỘNG ${testSets.length} BỘ):\n`;
  
  if (preventDuplicates && testSets.length > 1) {
      setInstructions += `QUAN TRỌNG: Các câu hỏi giữa các Bộ đề khác nhau KHÔNG ĐƯỢC TRÙNG NHAU. Hãy sáng tạo nội dung mới.\n`;
  }

  const allFirstCodes: string[] = [];

  testSets.forEach((set, index) => {
    const variantStr = set.specificCodes || `${(index+1)*100+1}`;
    const codeList = variantStr.split(',').map(s => s.trim()).filter(s => s);
    const sourceCode = codeList[0];
    const derivedCodes = codeList.slice(1);

    allFirstCodes.push(sourceCode);

    setInstructions += `
---------------------------------------------------
BỘ ĐỀ SỐ ${index + 1}:
1. MÃ ĐỀ GỐC: ${sourceCode}
2. CÁC MÃ ĐỀ TRỘN: ${derivedCodes.join(", ")}
   - QUY TẮC TRỘN ĐỀ (NGHIÊM NGẶT):
     + Phần Tự luận (II): GIỮ NGUYÊN thứ tự và nội dung.
     + Phần Trắc nghiệm (I):
       1. HOÁN VỊ THỨ TỰ CÂU HỎI: Đảo lộn vị trí các câu hỏi trong cùng một phần (Ví dụ: Câu 1 đề gốc -> Câu 5 đề trộn).
       2. HOÁN VỊ ĐÁP ÁN: Đảo lộn vị trí các lựa chọn A, B, C, D.
3. YÊU CẦU HƯỚNG DẪN CHẤM:
   - Lập bảng so sánh đáp án của [${sourceCode}, ${derivedCodes.join(", ")}] đặt cạnh nhau.
   - Lưu ý: Vì đã trộn câu hỏi, nên hàng số 1 trong bảng đáp án phải tương ứng với Câu 1 của từng mã đề (dù nội dung câu 1 của các mã đề khác nhau).
---------------------------------------------------
`;
  });

  let contentInstruction = "";
  if (matrixFileContent && !topics.length) {
    // Truncate excessively long inputs to prevent network errors
    const MAX_LENGTH = 30000;
    const cleanContent = matrixFileContent.length > MAX_LENGTH 
      ? matrixFileContent.substring(0, MAX_LENGTH) + "\n...[Nội dung đã được cắt bớt]..." 
      : matrixFileContent;
    contentInstruction = `NỘI DUNG MA TRẬN / TÀI LIỆU CUNG CẤP:\n${cleanContent}`;
  } else {
    const { matrixStr, globalTotals } = formatTopicMatrix(topics);
    contentInstruction = `MA TRẬN:\n${matrixStr}\n
QUY ĐỊNH CẤU TRÚC VÀ ĐIỂM SỐ:
- Tổng số câu: ${globalTotals.mc} (Phần 1), ${globalTotals.tf} (Phần 2), ${globalTotals.sa} (Phần 3), ${globalTotals.es} (Tự luận).
- Điểm chi tiết:
  + Phần 1 (TN nhiều lựa chọn): ${pointValues.multipleChoice} điểm/câu.
  + Phần 2 (TN Đúng/Sai): ${pointValues.trueFalse} điểm/câu.
  + Phần 3 (TN Trả lời ngắn): ${pointValues.shortAnswer} điểm/câu.
  + Tự luận: ${pointValues.essay} điểm/câu.`;
  }

  let finalPrompt = `Hãy soạn đề kiểm tra Toán ${grade} (${duration}) bám sát SGK CHÂN TRỜI SÁNG TẠO.

${setInstructions}

${contentInstruction}

YÊU CẦU CUỐI CÙNG: NGÂN HÀNG CÂU HỎI
Lập bảng tổng hợp câu hỏi từ các Mã đề Gốc (${allFirstCodes.join(", ")}).
Định dạng bảng: | Chủ đề | Câu | Mức độ | Nội dung câu hỏi (dùng <br> tách đáp án A,B,C,D) | Đáp án | Thang điểm |

${additionalRequest ? `YÊU CẦU THÊM: "${additionalRequest}"` : ""}
`;

  return finalPrompt;
};

// --- HELPER: Convert File to Base64 for Gemini ---
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateMathTest = async (params: TestParams, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) throw new Error("API Key chưa được cung cấp.");
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelId = "gemini-2.5-flash"; 

    // Use Streaming to prevent timeout errors for large payloads
    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: generateUserPrompt(params),
      config: {
        systemInstruction: generateSystemInstruction(),
        temperature: 0.9, 
      },
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullText += chunk.text;
      }
    }

    return fullText || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        if (error.message.includes("500") || error.message.includes("xhr error") || error.message.includes("RPC failed")) {
             throw new Error("Lỗi kết nối (500/XHR/RPC). Dữ liệu quá lớn hoặc mạng không ổn định. Hãy thử giảm số lượng bộ đề hoặc cắt bớt file ma trận.");
        }
    }
    throw error instanceof Error ? error : new Error("Lỗi không xác định từ Gemini.");
  }
};

// --- IMPROVED FUNCTION: PARSE MATRIX FROM TEXT WITH CURRICULUM DATA SUPPORT ---
export const parseMatrixFromText = async (text: string, apiKey: string): Promise<{topics: Topic[], detectedGrade: string | null}> => {
    if (!apiKey) throw new Error("API Key required");
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelId = "gemini-2.5-flash";

    // 1. Detect Grade Locally First (Heuristic)
    let detectedGrade: string | null = null;
    if (text.match(/Lớp\s*6/i)) detectedGrade = "Lớp 6";
    else if (text.match(/Lớp\s*7/i)) detectedGrade = "Lớp 7";
    else if (text.match(/Lớp\s*8/i)) detectedGrade = "Lớp 8";
    else if (text.match(/Lớp\s*9/i)) detectedGrade = "Lớp 9";

    // 2. Prepare Relevant Curriculum Data for Context
    let curriculumContext = "";
    let validTopicsForGrade: any[] = [];
    
    if (detectedGrade) {
        validTopicsForGrade = CURRICULUM_DATA.filter(item => item.grade === detectedGrade);
        const topicList = validTopicsForGrade.map(t => `- ${t.topic} (Thuộc chương: ${t.parentTopic})`).join("\n");
        curriculumContext = `
DƯỚI ĐÂY LÀ DANH SÁCH CHỦ ĐỀ CHUẨN CỦA ${detectedGrade}.
HÃY ƯU TIÊN SỬ DỤNG TÊN CHỦ ĐỀ TRONG DANH SÁCH NÀY ĐỂ KHỚP VỚI NỘI DUNG TRONG FILE:
${topicList}
        `;
    }

    const prompt = `
    Phân tích văn bản sau đây (được trích xuất từ file Ma trận đề thi).
    Mục tiêu: Trích xuất danh sách chủ đề và số lượng câu hỏi ở từng mức độ (Nhận biết, Thông hiểu, Vận dụng).

    ${curriculumContext}

    Input text (từ file):
    ${text.substring(0, 20000)} // Limit context

    Yêu cầu Output:
    Trả về MỘT JSON duy nhất. 
    1. Nếu tìm thấy tên chủ đề khớp hoặc gần giống trong danh sách chuẩn, hãy dùng tên chuẩn đó.
    2. Nếu ma trận gộp các mức độ, hãy cố gắng phân chia hợp lý.
    
    Cấu trúc JSON:
    {
      "detectedGrade": "Lớp 6" | "Lớp 7" | "Lớp 8" | "Lớp 9" | null,
      "topics": [ 
        { 
            "name": "Tên chủ đề con", 
            "parentName": "Tên chương lớn (nếu có)", 
            "matrix": {
                "multipleChoice": { "recognition": number, "comprehension": number, "application": number },
                "trueFalse": { "recognition": number, "comprehension": number, "application": number },
                "shortAnswer": { "recognition": number, "comprehension": number, "application": number },
                "essay": { "recognition": number, "comprehension": number, "application": number }
            }
        } 
      ]
    }
    `;

    try {
        const result = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const jsonText = result.text;
        const parsed = JSON.parse(jsonText);
        
        // --- SANITIZE & NORMALIZE TOPICS WITH LOCAL DATA ---
        const sanitizedTopics: Topic[] = (Array.isArray(parsed.topics) ? parsed.topics : []).map((t: any) => {
            const sanitizeLevel = (l: any) => ({
                recognition: Number(l?.recognition) || 0,
                comprehension: Number(l?.comprehension) || 0,
                application: Number(l?.application) || 0,
            });

            // Post-processing: Try to match with Standard Data to fill missing info (like ParentName)
            let finalName = t.name || "Chủ đề chưa đặt tên";
            let finalParentName = t.parentName || "";
            let description = t.description || "";

            // Fuzzy match logic: Check if returned name is a substring of a standard topic or vice versa
            if (detectedGrade) {
                const match = validTopicsForGrade.find(vt => 
                    vt.topic.toLowerCase().includes(finalName.toLowerCase()) || 
                    finalName.toLowerCase().includes(vt.topic.toLowerCase())
                );
                
                if (match) {
                    finalName = match.topic; // Use exact standard name
                    if (!finalParentName) finalParentName = match.parentTopic; // Auto-fill parent if missing
                    // Optionally auto-fill description from standard content if empty
                    if (!description && match.content) {
                       description = `Gợi ý: ${match.content.nb.concat(match.content.th).slice(0, 3).join("; ")}...`;
                    }
                }
            }

            return {
                id: t.id || Date.now().toString() + Math.random().toString().slice(2),
                name: finalName,
                parentName: finalParentName,
                description: description,
                matrix: {
                    multipleChoice: sanitizeLevel(t.matrix?.multipleChoice),
                    trueFalse: sanitizeLevel(t.matrix?.trueFalse),
                    shortAnswer: sanitizeLevel(t.matrix?.shortAnswer),
                    essay: sanitizeLevel(t.matrix?.essay),
                }
            };
        });

        return {
            topics: sanitizedTopics,
            detectedGrade: parsed.detectedGrade || detectedGrade || null
        };
    } catch (e) {
        console.error("Parse Matrix Error", e);
        throw new Error("Không thể phân tích ma trận từ file. Vui lòng kiểm tra định dạng file.");
    }
}

// --- NEW FUNCTION: ANALYZE IMAGE TO EXTRACT TIKZ STYLE ---
export const analyzeTikZStyle = async (imageFile: File, apiKey: string): Promise<string> => {
    try {
        if (!apiKey) throw new Error("API Key chưa được cung cấp.");
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const modelId = "gemini-2.5-flash";

        const imagePart = await fileToGenerativePart(imageFile);
        
        const prompt = `Bạn là chuyên gia về LaTeX và TikZ. Phân tích phong cách vẽ (màu sắc, nét vẽ, điểm) của hình này để tôi tái sử dụng.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: [imagePart, { text: prompt }],
        });

        return response.text || "Không phân tích được phong cách.";
    } catch (error) {
        console.error("Analyze Image Error:", error);
        throw error;
    }
};

// --- DIRECT TIKZ GENERATION ---
export const generateTikZCode = async (description: string, apiKey: string, styleContext?: string): Promise<string> => {
    try {
        if (!apiKey) throw new Error("API Key chưa được cung cấp.");
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const modelId = "gemini-2.5-flash";

        const prompt = `Viết code TikZ cho hình học THCS. Phong cách SGK Chân trời sáng tạo (nét 0.8pt, màu xanh/đen, điểm tròn nhỏ).
        ${styleContext ? `Style tham khảo: ${styleContext}` : ""}
        Nội dung: ${description}
        Chỉ trả về block code \`\`\`latex ... \`\`\`.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        
        const text = response.text || "";
        const match = text.match(/```latex([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
        return match ? match[1].trim() : text;
    } catch (error) {
        console.error("TikZ Error:", error);
        return "Lỗi tạo mã TikZ.";
    }
}
