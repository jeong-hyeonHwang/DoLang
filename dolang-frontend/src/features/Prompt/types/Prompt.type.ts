import { Tag } from '@/features/Matching/types/Matching.type';
export interface PromptQuestionRequest {
  interestA: Tag[];
  interestB: Tag[];
}

export interface PromptQuestionResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: string[];
}

export interface PromptDateSentenceResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: string;
}
