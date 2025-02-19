import { useQuery } from '@tanstack/react-query';
import { getFeed, getFeedParticipants } from '../services/feedService';
import { getMyFeed, getFeedWithMyReaction } from '../services/myFeedService';
import { MyFeedRequest } from '../types/MyFeedRequest.type';
import { FeedParticipantsRequest } from '../types/FeedParticipantsRequest.type';
// 피드 데이터 페칭
export const useFeedSentence = (lang: 'ko' | 'en') => {
  const {
    data,
    isLoading,
    error: feedSentenceError,
  } = useQuery({
    queryKey: ['feedSentence', lang],
    queryFn: () => getFeed({ lang }),
  });

  return { data, isLoading, error: feedSentenceError };
};

// 피드 참여 데이터 페칭
export const useFeedParticipaticipants = (params: Partial<FeedParticipantsRequest>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feedParticipants', params],
    queryFn: () => getFeedParticipants({ ...params, length: params.length ?? 5 }),
    staleTime: 0,
    notifyOnChangeProps: 'all',
  });

  return { data, isLoading, error };
};

// 내 피드 페칭
export const useMyFeed = (params: Partial<MyFeedRequest>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myFeed', params],
    queryFn: () => getMyFeed(params),
  });

  return { data, isLoading, error };
};

// 내가 반응을 남긴 피드 목록 페칭
export const useFeedWithMyReaction = (params: Partial<MyFeedRequest>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feedWithMyReaction', params],
    queryFn: () => getFeedWithMyReaction(params.lang as 'en' | 'kr'),
  });

  return { data, isLoading, error };
};

// 내가 반응을 남긴 개별 피드 음성 기록 페칭
export const useFeedVoice = (feedId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feedVoice', feedId],
    queryFn: () => getFeedVoice(feedId),
  });

  return { data, isLoading, error };
};
  