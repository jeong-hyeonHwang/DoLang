import { useEffect, useState } from 'react';
import { useStompClientContext } from '../hooks/useClientContext';
import VoiceCallMatchingIndicator from './VoiceCallMatchingIndicator';
import { usePeerContext } from '../../VoiceCall/hooks/usePeerContext';
import Cookies from 'js-cookie';
import { css } from '@emotion/react';

export const MatchingComponent = () => {
  const { isConnected, isMatching, matchingResult, connectionError, connect, cancelMatching, startMatching } =
    useStompClientContext();
  const { peerId } = usePeerContext();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // isConnected가 false인 경우 connect
  useEffect(() => {
    if (!isConnected) {
      connect(accessToken);
    }
  }, [isConnected, accessToken, connect]);

  const showMatchingProgress = isMatching;
  const showCancelButton = isMatching && !matchingResult;
  const showStartButton = !isMatching && peerId;
  const showMatchedUser = !!matchingResult?.matchedUser;

  return (
    <div className="matching-component-container" css={matchingComponentContainerStyle}>
      {connectionError && <div>{connectionError}</div>}
      {isConnected && (
        <div className="matching-component-button-container" css={matchingComponentButtonContainerStyle}>
          {showMatchingProgress && (
            <div>
              <VoiceCallMatchingIndicator />
              <span>매칭 중입니다...</span>
            </div>
          )}
          {showCancelButton && <button onClick={cancelMatching}>매칭 취소</button>}
          {showStartButton && !matchingResult && <button onClick={startMatching}>매칭 시작</button>}
          {!isConnected || (!peerId && <p>연결중입니다...</p>)}
          {showMatchedUser && <div>{matchingResult?.matchedUser.nickname}님과 매칭되었습니다!</div>}
        </div>
      )}
    </div>
  );
};

const matchingComponentContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
`;

const matchingComponentButtonContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
