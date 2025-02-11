import React from 'react';
import { useMatching } from '@/features/Matching/hooks/useMatching.ts';
import VoiceCallMatchingIndicator from './VoiceCallMatchingIndicator.tsx';
import { useQueryClient } from '@tanstack/react-query';

const MatchingComponent = () => {
  const { startMatching, matchingStatus, isLoading, error } = useMatching();
  const queryClient = useQueryClient();

  return (
    <div>
      {/* 로딩 상태 */}
      {isLoading && <VoiceCallMatchingIndicator />}
      {/* 매칭 시작 버튼 */}
      <button
        onClick={() =>
          startMatching({
            user: { id: 1, name: 'test', flag: 'test', image: null },
            interests: ['coding', 'music'],
          })
        }
        disabled={matchingStatus?.status === 'match_started'}
      >
        {matchingStatus?.status === 'match_started' ? '매칭 중...' : '매칭 시작'}
      </button>

      {/* 매칭 진행 중 */}
      {matchingStatus?.status === 'match_started' && <p>상대를 찾고 있습니다...</p>}

      {/* 매칭 완료 */}
      {matchingStatus?.status === 'match_found' && (
        <div>
          <p>매칭 성공!</p>
          <p>매칭된 유저: {matchingStatus?.matchedUser.id}</p>
        </div>
      )}

      {/* 에러 발생 시 */}
      {error && <p style={{ color: 'red' }}>에러 발생: {error.message}</p>}
    </div>
  );
};

export default MatchingComponent;
