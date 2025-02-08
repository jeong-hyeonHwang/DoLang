import { StompClientProvider } from '../../features/Matching/hooks/useClientContext.tsx';
import MatchingComponent from '../../features/Matching/components/MatchingComponent.tsx';

interface MatchResultResponse {
  id: number;
  message: string;
}

const VoiceCallView = () => {
  return (
    <div>
      <StompClientProvider>
        <MatchingComponent />
      </StompClientProvider>
    </div>
  );
};

export default VoiceCallView;
