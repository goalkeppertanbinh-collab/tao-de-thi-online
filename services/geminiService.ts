
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

QUY ĐỊNH VỀ ĐỊNH DẠNG TOÁN HỌC (LATEX - CỰC KỲ QUAN TRỌNG):
Tuyệt đối không lạm dụng dấu $. Hãy phân biệt rõ ràng giữa "Văn bản" và "Toán học".

1. CHỈ sử dụng dấu $ (LaTeX) cho các ĐỐI TƯỢNG TOÁN HỌC:
   - Biến số, tên điểm, tên hình: $x$, $y$, $A$, $B$, $\Delta ABC$, đường thẳng $d$...
   - Công thức, phương trình, biểu thức: $y = ax + b$, $x^2 - 4 = 0$, $\sqrt{x}$...
   - Số đo đi kèm đơn vị ký hiệu: $90^\circ$, $30cm$, $45m^2$...
   - Các con số nằm trong phép tính hoặc so sánh: $1 < x < 5$.

2. KHÔNG sử dụng dấu $ cho:
   - Văn bản tiếng Việt thông thường: "Cho tam giác", "Tính giá trị của", "số học sinh".
   - Số đếm thông thường hoặc số thứ tự bài/câu: "Câu 1", "Có 5 quả táo", "Bài 2".
   - Các dấu câu của văn bản (dấu chấm, phẩy cuối câu): Đặt $x=1$. (Dấu chấm nằm ngoài $).

3. VÍ DỤ:
   - ĐÚNG: Cho tam giác $ABC$ vuông tại $A$ có cạnh $AB = 3cm$. Tính diện tích $S$.
   - SAI (Lạm dụng): $Cho$ tam giác $ABC$ vuông tại $A$ có cạnh $AB$ = 3 $cm$. $Tính$ diện tích $S$.

QUY ĐỊNH ĐỊNH DẠNG HIỂN THỊ (NGHIÊM NGẶT):
1. TIÊU ĐỀ CÂU HỎI (Trong phần Đề thi):
   - Phải hiển thị ĐIỂM SỐ, KHÔNG hiển thị mức độ (NB, TH, VD).
   - Định dạng: **Câu [N] ([Điểm] điểm):** [Nội dung]

2. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (QUAN TRỌNG - KHÔNG CHÉP LẠI ĐỀ):
   - MỤC TIÊU: Tạo bảng để giáo viên chấm nhanh.
   - TUYỆT ĐỐI KHÔNG được chép lại nội dung câu hỏi hay đề bài vào phần này. Chỉ ghi kết quả/lời giải.
   - Phải tạo bảng so sánh đáp án của tất cả các mã đề trong bộ (Ví dụ: 901 và 902 nằm cạnh nhau).

   A. PHẦN TRẮC NGHIỆM (I, II, III):
   * Mẫu Bảng I (Nhiều lựa chọn):
   | Câu | Mã Đề [Code1] | Mã Đề [Code2] | ... | Điểm |
   |---|---|---|---|---|
   | 1 | A | C | ... | 0,25 |
   | 2 | B | A | ... | 0,25 |

   * Mẫu Bảng II (Đúng/Sai):
   Ghi đáp án dạng: a-Đ, b-S, c-Đ, d-S.
   | Câu | Mã Đề [Code1] | Mã Đề [Code2] | ... | Điểm |
   |---|---|---|---|---|
   | 13 | a-S, b-Đ, c-Đ, d-S | a-Đ, b-S, c-S, d-Đ | ... | 1,0 |

   * Mẫu Bảng III (Trả lời ngắn):
   | Câu | Mã Đề [Code1] | Mã Đề [Code2] | ... | Điểm |
   |---|---|---|---|---|
   | 15 | $x = 2$ | $x = -2$ | ... | 0,5 |

   B. PHẦN TỰ LUẬN (IV) - QUY TẮC BẢNG (RẤT QUAN TRỌNG):
   - BẮT BUỘC: Đáp án/Lời giải của MỘT câu phải nằm trọn trong MỘT Ô (Cell). KHÔNG ĐƯỢC để lời giải tràn sang cột khác hay dòng khác.
   - Khi cần xuống dòng trong lời giải: Sử dụng thẻ HTML <br> hoặc <br/>. KHÔNG ĐƯỢC dùng phím Enter (ký tự xuống dòng của Markdown) vì sẽ làm vỡ bảng.
   
   * Mẫu Bảng IV (Tự luận):
   | Câu | Lời giải sơ lược / Các bước chấm | Điểm |
   |---|---|---|
   | 19 | a) Phương trình... <br> $\Delta = ...$ (0,25 điểm) <br> => $x_1=..., x_2=...$ (0,25 điểm) | 1,0 |
   | | b) Thay x vào biểu thức P... (0,5 điểm) | |

   Lưu ý: Cột "Lời giải" chỉ ghi các bước giải vắn tắt và đáp số cuối cùng. KHÔNG chép lại đề bài.

QUY TRÌNH TẠO ĐỀ (LOGIC TRỘN):
1. Luôn soạn thảo Mã đề đầu tiên (Mã gốc) trước.
2. Các mã đề sau trong cùng một bộ sẽ được tạo ra bằng cách hoán vị (trộn) từ Mã gốc.
3. Tuyệt đối tuân thủ quy tắc giữ nguyên Tự luận nếu được yêu cầu.

CẤU TRÚC OUTPUT MONG MUỐN:
## BỘ ĐỀ SỐ [N] (Các mã: [Danh sách mã])

### ĐỀ KIỂM TRA MÃ [Mã Gốc]
...
---
### ĐỀ KIỂM TRA MÃ [Mã Trộn 1]
...
---
### ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (BỘ [N] - MÃ: [Mã Gốc], [Mã Trộn]...)

#### I. Trắc nghiệm:
(Bảng tổng hợp đáp án I, II, III - KHÔNG KÈM ĐỀ)

#### IV. Tự luận:
(Bảng lời giải và thang điểm - DÙNG THẺ <br> ĐỂ XUỐNG DÒNG TRONG Ô)

## NGÂN HÀNG CÂU HỎI
(Bảng tổng hợp câu hỏi nguồn từ Mã Gốc)
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
      setInstructions += `QUAN TRỌNG: Các câu hỏi giữa các Bộ đề khác nhau KHÔNG ĐƯỢC TRÙNG NHAU (Ví dụ: Câu 1 của Bộ 1 phải khác Câu 1 của Bộ 2). Hãy sáng tạo nội dung mới.\n`;
  }

  const allFirstCodes: string[] = [];

  testSets.forEach((set, index) => {
    const variantStr = set.specificCodes || `${(index+1)*100+1}`;
    const codeList = variantStr.split(',').map(s => s.trim()).filter(s => s);
    const sourceCode = codeList[0]; // Mã đề đầu tiên dùng để trộn
    const derivedCodes = codeList.slice(1); // Các mã sau

    allFirstCodes.push(sourceCode);

    setInstructions += `
---------------------------------------------------
BỘ ĐỀ SỐ ${index + 1}:
1. MÃ ĐỀ GỐC: ${sourceCode}
   - Hãy soạn thảo đề thi hoàn chỉnh cho mã này trước tiên dựa trên Ma trận.

`;
    
    if (derivedCodes.length > 0) {
        setInstructions += `2. CÁC MÃ ĐỀ TRỘN (BIẾN THỂ): ${derivedCodes.join(", ")}
   - Nguyên tắc: Lấy toàn bộ câu hỏi từ Mã đề GỐC (${sourceCode}) để tạo ra các mã này (Hoán vị).
`;
        if (set.enableShuffle) {
            setInstructions += `   - QUY TẮC TRỘN (QUAN TRỌNG):
     + Phần I, II, III (Trắc nghiệm, Đ/S, TLN): HOÁN VỊ thứ tự câu hỏi và thứ tự các đáp án (A,B,C,D) để tạo sự khác biệt.
     + Phần IV (Tự luận): GIỮ NGUYÊN 100% nội dung và thứ tự câu hỏi y hệt Mã đề GỐC (${sourceCode}). KHÔNG ĐƯỢC THAY ĐỔI HAY TRỘN TỰ LUẬN.
`;
        } else {
             setInstructions += `   - Yêu cầu: Tạo các đề tương đương hoặc giữ nguyên theo ý đồ thông thường.`;
        }
    }

    setInstructions += `
3. BẢNG ĐÁP ÁN TỔNG HỢP:
   - Lập bảng so sánh đáp án của [${sourceCode}, ${derivedCodes.join(", ")}] đặt cạnh nhau.
   - CHỈ HIỂN THỊ ĐÁP ÁN, KHÔNG CHÉP LẠI ĐỀ.
---------------------------------------------------
`;
  });

  let contentInstruction = "";
  if (matrixFileContent && !topics.length) {
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

YÊU CẦU VỀ NGÂN HÀNG CÂU HỎI (CUỐI CÙNG):
Hãy lập một bảng "NGÂN HÀNG CÂU HỎI" tổng hợp.
Bảng này PHẢI bao gồm toàn bộ nội dung câu hỏi của các MÃ ĐỀ GỐC sau: ${allFirstCodes.join(", ")}.
(Chỉ lấy câu hỏi từ các mã gốc, không lấy từ mã trộn).
Định dạng bảng: | Chủ đề | Câu | Mức độ | Nội dung câu hỏi (có LaTeX $) | Đáp án | Thang điểm |

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

// --- NEW FUNCTION: PARSE MATRIX FROM TEXT ---
export const parseMatrixFromText = async (text: string, apiKey: string): Promise<{topics: Topic[], detectedGrade: string | null}> => {
    if (!apiKey) throw new Error("API Key required");
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelId = "gemini-2.5-flash";

    const prompt = `
    Phân tích văn bản sau đây (được trích xuất từ file Ma trận đề thi).
    
    NHIỆM VỤ 1: Xác định xem ma trận này thuộc KHỐI LỚP nào (Lớp 6, Lớp 7, Lớp 8, hoặc Lớp 9) dựa trên các từ khóa kiến thức (ví dụ: "số tự nhiên"->Lớp 6, "số hữu tỉ"->Lớp 7, "hằng đẳng thức"->Lớp 8, "căn bậc hai"->Lớp 9).
    NHIỆM VỤ 2: Trích xuất danh sách các chủ đề và số lượng câu hỏi.

    Input text:
    ${text.substring(0, 15000)} // Limit context if too long

    Yêu cầu Output:
    Trả về MỘT JSON duy nhất. KHÔNG thêm giải thích.
    Cấu trúc JSON:
    {
      "detectedGrade": "Lớp 6" | "Lớp 7" | "Lớp 8" | "Lớp 9" | null,
      "topics": [
          {
            "id": "random_string",
            "name": "Tên chủ đề con / Nội dung kiến thức",
            "parentName": "Tên chương / Chủ đề lớn (nếu có)",
            "matrix": {
              "multipleChoice": { "recognition": number, "comprehension": number, "application": number },
              "trueFalse": { "recognition": number, "comprehension": number, "application": number },
              "shortAnswer": { "recognition": number, "comprehension": number, "application": number },
              "essay": { "recognition": number, "comprehension": number, "application": number }
            }
          }
      ]
    }
    
    Lưu ý mapping: "TN" -> multipleChoice; "TL" -> essay; "Đúng sai" -> trueFalse; "Trả lời ngắn" -> shortAnswer.
    `;

    try {
        const result = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const jsonText = result.text;
        const parsed = JSON.parse(jsonText);
        
        // Ensure structure compliance even if model hallucinates slightly
        return {
            topics: Array.isArray(parsed.topics) ? parsed.topics : [],
            detectedGrade: parsed.detectedGrade || null
        };
    } catch (e) {
        console.error("Parse Matrix Error", e);
        throw new Error("Không thể phân tích ma trận từ file. Hãy thử copy nội dung vào file text đơn giản hơn.");
    }
}

// --- NEW FUNCTION: ANALYZE IMAGE TO EXTRACT TIKZ STYLE ---
export const analyzeTikZStyle = async (imageFile: File, apiKey: string): Promise<string> => {
    try {
        if (!apiKey) throw new Error("API Key chưa được cung cấp.");
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const modelId = "gemini-2.5-flash";

        const imagePart = await fileToGenerativePart(imageFile);
        
        const prompt = `
        Bạn là chuyên gia về LaTeX và TikZ.
        Hãy phân tích hình ảnh này và trích xuất "Phong cách vẽ TikZ" (TikZ Style) để tôi có thể dùng lại phong cách này cho các hình khác.
        
        Hãy xác định và liệt kê chi tiết:
        1. Thư viện chính có vẻ được sử dụng (ví dụ: tkz-euclide, calc, angles, ...).
        2. Phong cách điểm (Point style): Kích thước, màu sắc (fill/draw), hình dáng (circle, dot).
        3. Phong cách đường (Line style): Độ dày (thick, thin, semithick), màu sắc, kiểu nét (dashed, solid).
        4. Phong cách nhãn (Label style): Font chữ, kích thước, vị trí tương đối so với điểm.
        5. Các ký hiệu đặc biệt: Ký hiệu góc vuông, góc bằng nhau, đoạn thẳng bằng nhau.
        
        TRẢ VỀ MỘT ĐOẠN VĂN BẢN MÔ TẢ NGẮN GỌN CÁC LỆNH/STYLE CẦN DÙNG.
        Ví dụ:
        - Dùng \\usepackage{tkz-euclide}
        - Điểm: \\tkzDrawPoints[size=3,fill=black]
        - Đường: thick, color=blue!70!black
        ...
        `;

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

        const prompt = `Hãy viết code LaTeX sử dụng gói TikZ (và tkz-euclide nếu là hình học phẳng) để vẽ hình cho bài toán hình học THCS theo phong cách sách giáo khoa 'Chân trời sáng tạo'.
        
        Yêu cầu về phong cách (Style Guide):
        - Nét vẽ: Sử dụng nét semithick (0.8pt) cho các đường chính. Đường khuất (nếu có) dùng nét đứt dashed.
        - Màu sắc: Viền hình màu đen hoặc xanh đậm (blue!70!black). Các miền diện tích (nếu cần tô) dùng màu nhạt (fill=blue!10 hoặc orange!10) để giống phong cách hiện đại của SGK mới.
        - Điểm và Nhãn: Các điểm (A, B, C...) dùng dấu chấm tròn nhỏ (\\fill bán kính 1.5pt), nhãn để cách điểm một khoảng vừa phải, font chữ không chân (nếu có thể) hoặc mặc định rõ ràng.
        - Góc: Ký hiệu góc vuông hoặc vòng cung góc cần gọn gàng.
        
        ${styleContext ? `--------------------------------------------------\nLƯU Ý ĐẶC BIỆT TỪ PHONG CÁCH NGƯỜI DÙNG ĐÃ HỌC:\n${styleContext}\n--------------------------------------------------` : ""}

        Nội dung hình vẽ:
        ${description}

        Yêu cầu Output: Chỉ xuất code trong môi trường \\begin{tikzpicture} ... \\end{tikzpicture} để tôi có thể copy vào file TeX có sẵn.
        - Code phải clean, đẹp, căn chỉnh tọa độ hợp lý để hình không bị méo.
        - Chỉ trả về mã nằm trong block code \`\`\`latex ... \`\`\`.
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });
        
        const text = response.text || "";
        const match = text.match(/```latex([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
        return match ? match[1].trim() : text;
    } catch (error) {
        console.error("TikZ Error:", error);
        return "Lỗi tạo mã TikZ.";
    }
}
