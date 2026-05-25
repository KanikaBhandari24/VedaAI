export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface AssignmentFormData {
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInstructions: string;
  fileContent?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInstructions?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface GeneratedQuestion {
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questionType: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
  sections: GeneratedSection[];
  answerKey: string[];
}

export interface AssignmentWithResult extends Assignment {
  result?: GeneratedPaper;
}