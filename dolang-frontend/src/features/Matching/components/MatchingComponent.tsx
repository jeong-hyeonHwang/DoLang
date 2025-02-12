import React, { useEffect, useState } from 'react';
import { useStompClientContext } from '../hooks/useClientContext';
import VoiceCallMatchingIndicator from './VoiceCallMatchingIndicator';
import { usePeerContext } from '../../VoiceCall/hooks/usePeerContext';

export const MatchingComponent = () => {
  const { isConnected, isMatching, matchedUser, connectionError, connect, disconnect, startMatching, cancelMatching } =
    useStompClientContext();
  const [accessToken, setAccessToken] = useState('');
  const { peerId } = usePeerContext();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    console.log(token);
    if (!token) return;
    setAccessToken(token);
  }, []);

  return (
    <div>
      <div>
        {peerId ? <div>peerId: {peerId}</div> : <div>peerId: null</div>}
        {!isConnected ? (
          <button onClick={() => connect(accessToken)}>Connect</button>
        ) : (
          <button onClick={disconnect}>Disconnect</button>
        )}
      </div>

      {connectionError && <div>{connectionError}</div>}

      <div style={{ margin: '15px 0', color: '#666' }}>
        Connection status:{' '}
        {isConnected ? (
          <span style={{ color: 'green' }}>Connected</span>
        ) : (
          <span style={{ color: 'red' }}>Disconnected</span>
        )}
      </div>

      {isConnected && (
        <div>
          {!isMatching && <button onClick={startMatching}>Start Matching</button>}
          {isMatching && (
            <div>
              <VoiceCallMatchingIndicator />
              <button onClick={cancelMatching}>Cancel Matching</button>
            </div>
          )}

          {matchedUser && <div>Successfully matched with user: {matchedUser.username}</div>}
        </div>
      )}
    </div>
  );
};
