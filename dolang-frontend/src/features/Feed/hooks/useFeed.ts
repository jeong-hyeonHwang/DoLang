import { useQuery } from '@tanstack/react-query';

import { getFeed, getFeedParticipation } from '../services/feedService';

// 피드 데이터 페칭
export const useFeeds = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feeds'],
    queryFn: () => getFeed({ lang: 'ko' }),
  });

  return { data, isLoading, error };
};

// 피드 참여 데이터 페칭
export const useFeedParticipation = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feedParticipation'],
    queryFn: () => getFeedParticipation({ length: 10 }),
  });

  return { data, isLoading, error };
};

// 유저 피드 참여
// export const useUserFeedParticipation = () => {
//   const { mutate, isPending, error } = useMutation({
//     mutationFn: postFeedParticipation,
//   });
//   return { mutate, isPending, error };
// };
