import React from 'react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { CallWaveIndicator } from '../../features/VoiceCall/components/CallWaveIndicator.tsx';
import { usePeerContext } from '../../features/VoiceCall/hooks/usePeerContext.tsx';
import { useCallContext } from '../../features/VoiceCall/hooks/useCallContext.tsx';
import VoiceCallChat from "@/features/VoiceCall/components/VoiceCallChat.tsx";

function VoiceCallView() {
  const { matchingResult } = useStompClientContext();
  const { localStream, remoteStream, startCall, endCall } = useCallContext();

  const { peerId, callStatus, remotePeerId, audioRef } = usePeerContext();
  // 오디오 태그에 localStream, remoteStream을 바인딩
  return (
    <>
      <div>
        <div className="call-participants-container">
          <div>
            <h2>Your Peer ID: {peerId}</h2>
            <p>Status: {callStatus}</p>
            <p>Remote Peer ID: {remotePeerId}</p>
            <div>
              <audio ref={audioRef} autoPlay controls />
            </div>
            <div></div>
          </div>
        </div>

        {/* 로컬 오디오 */}

        {localStream && (
          <audio
            autoPlay
            controls
            muted
            ref={(audio) => {
              if (audio && localStream) {
                audio.srcObject = localStream;
              }
            }}
          />
        )}

        {/* 리모트 오디오 */}
        {remoteStream && (
          <audio
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
      <VoiceCallChat />
    </>
  );
}

export default VoiceCallView;
