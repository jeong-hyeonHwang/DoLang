import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postBookmark, postHeart } from '../services/reactionService';
import { FeedParticipantsResponse } from '../types/FeedParticipantsResponse.type';

export const usePostBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: { feedId: number; postId: number }) => postBookmark(req.feedId, req.postId),
    onMutate: async (variables) => {
      const queryKey = ['feedParticipants', { feedId: variables.feedId }];

      await queryClient.cancelQueries({ queryKey });

      const oldData = queryClient.getQueryData<FeedParticipantsResponse>(queryKey);
      if (!oldData) return { previousData: undefined };

      const newParticipants = oldData.participants.map((participant) =>
        participant.postId === variables.postId
          ? {
              ...participant,
              isUserBookmarked: !participant.isUserBookmarked,
              bookmarkCount: participant.isUserBookmarked
                ? Math.max(0, participant.bookmarkCount - 1)
                : participant.bookmarkCount + 1,
            }
          : participant
      );
      const newData = {
        ...oldData,
        participants: [...newParticipants],
      };

      queryClient.setQueryData(queryKey, newData);
      return { previousData: oldData };
    },
    onError: (_, variables, context) => {
      console.error('onError');
      if (context?.previousData) {
        queryClient.setQueryData(['feedParticipants', { feedId: variables.feedId }], context.previousData);
      }
    },
  });
};

export const usePostHeart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: { feedId: number; postId: number }) => postHeart(req.feedId, req.postId),
    onMutate: async (variables) => {
      const queryKey = ['feedParticipants', { feedId: variables.feedId }];

      await queryClient.cancelQueries({ queryKey });

      const oldData = queryClient.getQueryData<FeedParticipantsResponse>(queryKey);
      if (!oldData) return { previousData: undefined };

      const newParticipants = oldData.participants.map((participant) =>
        participant.postId === variables.postId
          ? {
              ...participant,
              isUserHearted: !participant.isUserHearted,
              heartCount: participant.isUserHearted
                ? Math.max(0, participant.heartCount - 1)
                : participant.heartCount + 1,
            }
          : participant
      );
      const newData = {
        ...oldData,
        participants: [...newParticipants],
      };

      queryClient.setQueryData(queryKey, newData);
      return { previousData: oldData };
    },
    onError: (_, variables, context) => {
      console.error('onError');
      if (context?.previousData) {
        queryClient.setQueryData(['feedParticipants', { feedId: variables.feedId }], context.previousData);
      }
    },
  });
};
