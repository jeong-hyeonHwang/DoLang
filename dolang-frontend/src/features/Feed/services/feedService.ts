import axios from 'axios';
import { base, endpoints } from './api';

/* 
테스트를 위해 native, learningLanguage 요청과 엔드포인트가 분리되었습니다.
진행 상황에 맞춰, 또는 프로덕션 환경에서는 하나의 요청으로 통합될 예정입니다.
*/

export interface SentenceParams {
  lang: string;
}

export interface ParticipationParams {
  feedId: string;
  sort: string;
  length: number;
  nextCursor?: string;
}

const instance = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
  },
});

// 모국어 피드 문장 요청
export const getNativeFeedSentence = async (params: SentenceParams) => {
  const response = await instance.get(endpoints.NATIVE_SENTENCE, { params });
  return response.data;
};

// 학습 언어 피드 문장 요청
export const getLearningLanguageFeedSentence = async (params: SentenceParams) => {
  const response = await instance.get(endpoints.LEARNING_LANGUAGE_SENTENCE, { params });
  return response.data;
};

// 모국어 피드 참여 데이터 요청
export const getNativeFeedParticipation = async (params: ParticipationParams) => {
  const response = await instance.get(endpoints.NATIVE_PARTICIPATION, { params });
  return response.data;
};

// 학습 언어 피드 참여 데이터 요청
export const getLearningLanguageFeedParticipation = async (params: ParticipationParams) => {
  const response = await instance.get(endpoints.LEARNING_LANGUAGE_PARTICIPATION, {params});
  return response.data;
};

// 모국어 피드 참여 요청
export const postNativeFeedParticipation = async (params: ParticipationParams) => {
  const response = await instance.post(endpoints.NATIVE_PARTICIPATION, {params});
  return response.data;
};

// 학습 언어 피드 참여 요청
export const postLearningLanguageFeedParticipation = async (params: ParticipationParams) => {
  const response = await instance.post(endpoints.LEARNING_LANGUAGE_PARTICIPATION, {params});
  return response.data;
};