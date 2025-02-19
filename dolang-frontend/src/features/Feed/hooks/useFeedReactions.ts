import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postBookmark, postHeart } from '../services/reactionService';
import { FeedParticipant, FeedParticipantsResponse } from '../types/FeedParticipantsResponse.type';

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
      console.log('onError');
      if (context?.previousData) {
        queryClient.setQueryData(['feedParticipants', { feedId: variables.feedId }], context.previousData);
      }
    },
    onSuccess: (_, variables) => {},
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
              heartCount: participant.isUserHearted
                ? Math.max(0, participant.heartCount - 1)
                : participant.heartCount + 1,
              isUserHearted: !participant.isUserHearted, // 기존 false -> !isUserHearted로 변경
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
      if (context?.previousData) {
        queryClient.setQueryData(['feedParticipants', { feedId: variables.feedId }], context.previousData);
      }
    },
    onSuccess: (data, variables) => {
      const queryKey = ['feedParticipants', { feedId: variables.feedId }];
      const oldData = queryClient.getQueryData<FeedParticipantsResponse>(queryKey);
      if (!oldData) return;

      const updatedParticipants = oldData.participants.map((participant) =>
        participant.postId === variables.postId
          ? { ...participant, heartCount: data.newHeartCount, isUserHearted: data.isUserHearted }
          : participant
      );

      queryClient.setQueryData(queryKey, { ...oldData, participants: updatedParticipants });
    },
  });
};
