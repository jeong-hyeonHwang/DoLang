import React, { useEffect } from 'react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { useCallContext } from '../../features/VoiceCall/hooks/useCallContext.tsx';

function VoiceCallView() {
  const { matchingResult } = useStompClientContext();
  const { localStream, remoteStream, startCall, endCall } = useCallContext();

  // 매칭 완료 후 바로 startCall을 자동 시작하고 싶다면:
  useEffect(() => {
    if (matchingResult) {
      // 매칭 결과가 들어오면 오너 여부를 확인해서 바로 호출
      startCall();
    }
  }, [matchingResult, startCall]);

  // 오디오 태그에 localStream, remoteStream을 바인딩
  return (
    <div>
      <h1>Matching & Call Page</h1>
      <button onClick={startCall}>Start Call (Offer 생성)</button>
      <button onClick={endCall}>End Call</button>

      {/* 로컬 오디오 */}
      {localStream && (
        <video
          autoPlay
          controls
          muted
          ref={(video) => {
            if (video && localStream) {
              video.srcObject = localStream;
            }
          }}
        />
      )}

      {/* 리모트 오디오 */}
      {remoteStream && (
        <video
          autoPlay
          controls
          ref={(video) => {
            if (video && remoteStream) {
              video.srcObject = remoteStream;
            }
          }}
        />
      )}
    </div>
  );
}

export default VoiceCallView;
