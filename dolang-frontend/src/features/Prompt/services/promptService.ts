import axios from 'axios';
import { PromptDateSentenceResponse, PromptQuestionRequest, PromptQuestionResponse } from '../types/Prompt.type';
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export const getPromptQuestion = async ({ interestA, interestB }: PromptQuestionRequest) => {
  try {
    const response = await instance.post<PromptQuestionResponse>('/api/prompt/question', {
      interestA,
      interestB,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getPromptDateSentence = async () => {
  try {
    const response = await instance.get<PromptDateSentenceResponse>('/api/prompt/dateSentence');
    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};
