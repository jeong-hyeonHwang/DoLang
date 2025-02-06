import { MatchRequest, MatchResponse } from '@/features/Matching/types';
import { matchRequest, getMatchResult } from '../services/signalingService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// 매칭 시작 호출 및 결과 처리
export const useMatching = () => {
  const [matchId, setMatchId] = useState<number | null>(null);
  const [refetchInterval, setRefetchInterval] = useState<number | false>(3000);
  const [isPollingActive, setIsPollingActive] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // 매칭 시작 상태
  const startMatchingMutation = useMutation({
    mutationKey: ['matchId'],
    mutationFn: (request: MatchRequest) => matchRequest(request),
    onSuccess: (data: MatchResponse) => {
      if (data.matchId) {
        setMatchId(data.matchId);
        setIsPollingActive(true);
        queryClient.setQueryData(['matchingStatus'], data);
        queryClient.invalidateQueries({ queryKey: ['matchingStatus'] });
      }
    },
  });

  // 매칭 상태 폴링
  const matchingStatusQuery = useQuery({
    queryKey: ['matchingStatus'],
    queryFn: () => {
      const cachedData = queryClient.getQueryData<MatchResponse>(['matchingStatus']);
      const currentMatchId = cachedData?.matchId ?? matchId;

      if (!currentMatchId) return Promise.reject(new Error('No matchId'));
      return getMatchResult(currentMatchId);
    },
    refetchInterval: refetchInterval,
    enabled: !!matchId && isPollingActive,
    select: (data: MatchResponse) => {
      if (data.status === 'match_started') queryClient.invalidateQueries({ queryKey: ['matchingStatus'] }); // 매칭 중일 경우 계속 폴링 유지
      if (data.status === 'match_found') {
        queryClient.setQueryData(['matchingStatus'], null);
        setRefetchInterval(false);
        setIsPollingActive(false);
        connectWebSocket(data.matchId);
      }

      console.log(data);
      return data;
    },

    meta: {
      data: queryClient.getQueryData(['matchingStatus']),
    },
  });

  // 매칭 상대와 웹소켓 연결
  const connectWebSocket = (matchId: number) => {
    // const socket = new WebSocket(`ws://localhost:8080/match/${matchId}`);
    console.log('웹소켓 연결', matchId);
  };

  // 매칭 실패시 처리
  const handleMatchFail = () => {
    setRefetchInterval(0);
  };

  return {
    startMatching: startMatchingMutation.mutateAsync,
    matchRequestStatus: startMatchingMutation.data?.status,
    matchingStatus: matchingStatusQuery.data,
    isLoading: matchingStatusQuery.isFetching,
    error: startMatchingMutation.error || matchingStatusQuery.error,
    handleMatchFail,
  };
};
