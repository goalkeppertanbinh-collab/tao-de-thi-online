
import { TestParams } from "./types";

export const GRADES = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"];
export const DURATIONS = ["15 phút", "45 phút", "60 phút", "90 phút"];

export const DEFAULT_PARAMS: TestParams = {
  grade: "Lớp 9",
  duration: "90 phút",
  testSets: [
    {
      id: 1,
      fileName: "Bo_De_So_1",
      specificCodes: "601, 602",
      quantity: 2,
      enableShuffle: false
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
  topics: [
    {
      id: "default-1",
      name: "Phương trình bậc hai một ẩn",
      matrix: {
        // TARGET DISTRIBUTION: Biết 4.0 (40%), Hiểu 3.0 (30%), Vận dụng 3.0 (30%)
        // MC (0.25/q): 4 B, 4 H, 4 VD -> 1.0, 1.0, 1.0
        multipleChoice: { recognition: 4, comprehension: 4, application: 4 }, 
        
        // TF (1.0/q): 1 B, 1 H, 0 VD -> 1.0, 1.0, 0
        trueFalse: { recognition: 1, comprehension: 1, application: 0 },      
        
        // SA (0.5/q): 2 B, 2 H, 0 VD -> 1.0, 1.0, 0
        shortAnswer: { recognition: 2, comprehension: 2, application: 0 },    
        
        // Essay (1.0/q): 1 B, 0 H, 2 VD -> 1.0, 0, 2.0
        essay: { recognition: 1, comprehension: 0, application: 2 }
        
        // TOTALS:
        // B: 1+1+1+1 = 4.0
        // H: 1+1+1+0 = 3.0
        // VD: 1+0+0+2 = 3.0
      }
    }
  ],
};
