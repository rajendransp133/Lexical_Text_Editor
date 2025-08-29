export type QuestionType = 'mcq' | 'msq' | 'nat';

export interface BaseQuestion {
  id: string;
  question: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  answer: number; // Index of correct option
}

export interface NATQuestion extends BaseQuestion {
  type: 'nat';
  start?: number; // Minimum allowed value
  end?: number; // Maximum allowed value
  precision?: number; // Number of decimal places
}

export interface MSQQuestion extends BaseQuestion {
  type: 'msq';
  options: string[];
  answer: number[]; // Array of indices of correct options
}

export interface BaseQuestionWeightage {
  type: QuestionType;
  count: number;
  marks: number;
  positive: number;
  negative: number;
  attempt?: number;
  partial?: boolean; // Optional, only meaningful for msq
}

export type Weightage =
  | (BaseQuestionWeightage & {
      type: 'mcq';
      partial?: never;
      questions: MCQQuestion[];
    })
  | (BaseQuestionWeightage & {
      type: 'msq';
      negative: 0;
      questions: MSQQuestion[];
    })
  | (BaseQuestionWeightage & {
      type: 'nat';
      negative: 0;
      partial?: never;
      questions: NATQuestion[];
    });

export interface Section {
  name: string;
  totalmarks: number;
  duration?: number;
  totalquestion: number;
  weightage: Weightage[];
}

export interface JEEStructure {
  id: string;
  name: string;
  total_marks: number;
  duration: number;
  section: Section[];
}
