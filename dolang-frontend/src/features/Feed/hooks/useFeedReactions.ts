import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postBookmark, postHeart } from '../services/reactionService';

export const usePostBookmark = (feedId: number, postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['feedBookmark', feedId, postId],
    mutationFn: () => postBookmark(feedId, postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feedBookmark', feedId, postId] });
      const previousData = queryClient.getQueryData(['feedBookmark', feedId, postId]);
      queryClient.setQueryData(['feedBookmark', feedId, postId], (old: any) => ({
        ...old,
        bookmarkCount: old.bookmarkCount + (old.isBookmarked ? -1 : 1),
        isBookmarked: !old.isBookmarked,
      }));
      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['feedBookmark', feedId, postId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedBookmark', feedId, postId] });
    },
  });
};

export const usePostHeart = (feedId: number, postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['feedHeart', feedId, postId],
    mutationFn: () => postHeart(feedId, postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feedHeart', feedId, postId] });
      const previousData = queryClient.getQueryData(['feedHeart', feedId, postId]);
      queryClient.setQueryData(['feedHeart', feedId, postId], (old: any) => ({
        ...old,
        heartCount: old.heartCount + (old.isHearted ? -1 : 1),
        isHearted: !old.isHearted,
      }));
      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['feedHeart', feedId, postId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedHeart', feedId, postId] });
    },
  });
};
