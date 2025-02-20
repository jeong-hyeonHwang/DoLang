import { PromptDateSentenceResponse, PromptQuestionRequest, PromptQuestionResponse } from '../types/Prompt.type';
import { apiInstance } from '@/api/utils/instance';

export const getPromptQuestion = async ({
  interestA,
  interestB,
}: PromptQuestionRequest): Promise<PromptQuestionResponse> => {
  try {
    const response = await apiInstance.post<PromptQuestionResponse>('/api/prompt/question', {
      interestA,
      interestB,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    return {
      isSuccess: false,
      code: 500,
      message: '질문을 불러오는 중 오류가 발생했습니다.',
      result: [],
    };
  }
};

export const getPromptDateSentence = async () => {
  try {
    const response = await apiInstance.get<PromptDateSentenceResponse>('/api/prompt/dateSentence');
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};
