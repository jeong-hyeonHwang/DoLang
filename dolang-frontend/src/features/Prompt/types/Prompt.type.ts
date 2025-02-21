export interface PromptQuestionRequest {
  interestA: string[];
  interestB: string[];
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
