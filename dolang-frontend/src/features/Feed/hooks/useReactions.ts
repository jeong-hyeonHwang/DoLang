import { useMutation } from '@tanstack/react-query';
import { postBookmark, postHeart } from '../services/reactionService';

export const usePostBookmark = (callback: (data: any) => void) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ feedId, postId }: { feedId: number; postId: number }) => postBookmark(feedId, postId),
    onSuccess: (data) => callback(data),
    onError: (error) => callback(error),
  });

  return { mutate, isPending, error };
};

export const usePostHeart = (callback: (data: any) => void) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ feedId, postId }: { feedId: number; postId: number }) => postHeart(feedId, postId),
    onSuccess: (data) => callback(data),
    onError: (error) => callback(error),
  });

  return { mutate, isPending, error };
};
