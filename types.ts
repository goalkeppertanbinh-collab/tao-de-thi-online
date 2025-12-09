
export interface LevelCounts {
  recognition: number; // NB
  comprehension: number; // TH
  application: number; // VD
}

export interface TopicMatrix {
  multipleChoice: LevelCounts;
  trueFalse: LevelCounts;
  shortAnswer: LevelCounts;
  essay: LevelCounts;
}

export interface Topic {
  id: string;
  name: string; // Sub-topic / Content
  parentName?: string; // Major Topic / Chapter
  description?: string; // Detailed suggestion for the AI
  matrix: TopicMatrix;
}

export interface PointValues {
  multipleChoice: number;
  trueFalse: number;
  shortAnswer: number;
  essay: number;
}

export interface TestSetConfig {
  id: number;
  fileName: string;
  specificCodes: string; // e.g. "601, 602"
  quantity: number; // e.g. 2
  enableShuffle: boolean;
}

export interface HeaderData {
  matrix: string;
  spec: string;
  bank: string;
  exam: string;
  hdc: string;
}

export interface TestParams {
  subject: string; // New field
  examTerm: string; // New field
  grade: string;
  duration: string;
  testSets: TestSetConfig[];
  preventDuplicates: boolean; // New flag for checking duplicates between sets
  matrixFileContent?: string;
  topics: Topic[];
  pointValues: PointValues;
  additionalRequest: string;
  headerData: HeaderData; // New field for headers
}

export interface GenerationState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}
