
import { TestParams } from "./types";

export const GRADES = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"];
export const DURATIONS = ["45 phút", "60 phút", "90 phút"];
export const SUBJECTS = ["Toán", "Vật lí", "Hóa học", "Sinh học", "Tin học", "Công nghệ", "KHTN","LS&ĐL"];
export const EXAM_TERMS = [
  "GIỮA KÌ I", 
  "CUỐI KÌ I", 
  "GIỮA KÌ II", 
  "CUỐI KÌ II", 
  "KHẢO SÁT CHẤT LƯỢNG",
  "THI THỬ VÀO 10"
];

export const DEFAULT_PARAMS: TestParams = {
  subject: "Toán",
  examTerm: "GIỮA KÌ I",
  grade: "Lớp 9",
  duration: "90 phút",
  testSets: [
    {
      id: 1,
      fileName: "Bo_De_So_1",
      specificCodes: "901, 902",
      quantity: 2,
      enableShuffle: true 
    }
  ],
  preventDuplicates: true,
  additionalRequest: "",
  pointValues: {
    multipleChoice: 0.25, // Points per question
    trueFalse: 1.0,       // Max points per question (4 sub-parts)
    shortAnswer: 0.5,     // Points per question
    essay: 1.0            // Points per question (avg)
  },
  topics: [], // Default empty topics list
  headerData: {
    matrix: "",
    spec: "",
    bank: "",
    exam: "",
    hdc: ""
  }
};
