import React, { useState } from 'react';
import { useStompClientContext } from '../hooks/useClientContext';
import VoiceCallMatchingIndicator from './VoiceCallMatchingIndicator';

const MatchingComponent = () => {
  const { isConnected, isMatching, matchedUser, connectionError, connect, disconnect, startMatching, cancelMatching } =
    useStompClientContext();

  const [accessToken, setAccessToken] = useState('');
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Enter Access Token"
          value={accessToken}
          onChange={(e) => {
            setAccessToken(e.target.value);
            console.log(accessToken);
          }}
        />
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

export default MatchingComponent;
