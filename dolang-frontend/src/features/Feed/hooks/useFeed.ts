import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getNativeFeedSentence,
  getLearningLanguageFeedSentence,
  getNativeFeedParticipation,
  postLearningLanguageFeedParticipation,
} from '../services/feedService';

// 모국어 피드 데이터 페칭
export const useNativeFeeds = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feeds'],
    queryFn: getNativeFeedSentence,
  });

  return { data, isLoading, error };
};

// 학습 언어 피드 데이터 페칭
export const useLearningLanguageFeeds = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feeds'],
    queryFn: getLearningLanguageFeedSentence,
  });

  return { data, isLoading, error };
};

// 유저 피드 참여
export const useNativeFeedParticipation = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: getNativeFeedParticipation,
  });

  return { mutate, isPending, error };
};

// 학습 언어 피드 참여
export const useLearningLanguageFeedParticipation = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: postLearningLanguageFeedParticipation,
  });

  return { mutate, isPending, error };
};