import { postFeedVoiceUpload } from '@/features/Feed/services/feedService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useVoiceUpload = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: ({ feedId, file }: { feedId: number; file: File }) => postFeedVoiceUpload({ feedId, file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { mutate, isPending, isSuccess, error };
};
