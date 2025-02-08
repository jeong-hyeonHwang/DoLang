import axios from 'axios';
import { endpoints } from './api';

// 모국어 피드 문장 요청
export const getNativeFeedSentence = async () => {
  const response = await axios.get(endpoints.NATIVE_SENTENCE);
  return response.data;
};

// 학습 언어 피드 문장 요청
export const getLearningLanguageFeedSentence = async () => {
  const response = await axios.get(endpoints.LEARNING_LANGUAGE_SENTENCE);
  return response.data;
};

// 모국어 피드 참여 데이터 요청
export const getNativeFeedParticipation = async () => {
  const response = await axios.get(endpoints.NATIVE_PARTICIPATION);
  return response.data;
};

// 학습 언어 피드 참여 데이터 요청
export const getLearningLanguageFeedParticipation = async () => {
  const response = await axios.get(endpoints.LEARNING_LANGUAGE_PARTICIPATION);
  return response.data;
};

// 모국어 피드 참여 요청
export const postNativeFeedParticipation = async () => {
  const response = await axios.post(endpoints.NATIVE_PARTICIPATION);
  return response.data;
};

// 학습 언어 피드 참여 요청
export const postLearningLanguageFeedParticipation = async () => {
  const response = await axios.post(endpoints.LEARNING_LANGUAGE_PARTICIPATION);
  return response.data;
};