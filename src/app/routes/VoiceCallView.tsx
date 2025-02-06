import { useEffect } from 'react';
import VoiceCallStartMenu from '../../features/VoiceCall/components/VoiceCallStartMenu';
import { useQuery } from '@tanstack/react-query';

interface MatchResultResponse {
  id: number;
  message: string;
}

const fetchMatchResult = async (): Promise<MatchResultResponse> => {
  const response = await axios.get('/api/voice-call/match/result');
  return response.data;
};

const MatchedPage = () => {
  const { data, isPending, error } = useQuery(['matchResult'], fetchMatchResult);

  if (isPending) {
    return <div>Loading match result...</div>;
  }

  if (error) {
    return <div>Error fetching match result: {error.message}</div>;
  }

  return (
    <div>
      <h1>매칭 완료!</h1>
      <p>{data?.message}</p>
    </div>
  );
};

const VoiceCallView = () => {
  return <VoiceCallStartMenu />;
};

export default VoiceCallView;
