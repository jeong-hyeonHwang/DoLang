// CallContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useStompClientContext } from '../../Matching/hooks/useClientContext';

export interface CallContextValue {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: () => Promise<void>; // 오너가 통화 시작 (offer 생성)
  endCall: () => void; // 통화 종료
}

const CallContext = createContext<CallContextValue | null>(null);

export function useCallContext() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallContextProvider');
  }
  return context;
}

export const CallContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { matchingResult, stompClient } = useStompClientContext();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  // WebRTC 객체를 Refs로 보관
  const peerRef = useRef<RTCPeerConnection | null>(null);

  // =========================================
  // 1. 매칭결과가 들어올 때 roomId 세팅
  // =========================================
  useEffect(() => {
    if (!matchingResult) return;
    const { ownerYN, me, matchedUser } = matchingResult;
    // 오너라면 me.peerId, 아니면 matchedUser.peerId
    const newRoomId = ownerYN ? me.peerId : matchedUser.peerId;
    setRoomId(newRoomId);
  }, [matchingResult]);

  // =========================================
  // 2. PeerConnection 초기화 & Subscribe 설정
  // =========================================
  const initPeerConnection = useCallback(
    async (isOwner: boolean) => {
      // (1) 로컬 오디오 스트림 획득
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setLocalStream(stream);

        // (2) RTCPeerConnection 생성
        const pc = new RTCPeerConnection({
          iceServers: [
            {
              urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'],
            },
          ],
        });

        // (3) 로컬 트랙 추가
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // (4) ontrack 이벤트 → 상대 오디오 스트림 수신
        pc.ontrack = (event) => {
          console.log('Remote track received', event.streams);
          setRemoteStream(event.streams[0]);
        };

        // (5) onicecandidate 이벤트 → ICE candidate를 서버로 전송
        pc.onicecandidate = (event) => {
          if (event.candidate && roomId) {
            // STOMP를 통해 candidate를 전송 (예시)
            stompClient?.publish({
              destination: '/match/ice',
              body: JSON.stringify({
                roomId,
                type: 'candidate',
                candidate: event.candidate,
              }),
            });
          }
        };

        peerRef.current = pc;

        // (6) 오너라면 Offer 생성 → 서버로 전송
        if (isOwner) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          // STOMP로 offer 전송
          stompClient?.publish({
            destination: '/match/offer',
            body: JSON.stringify({ roomId, type: 'offer', sdp: offer }),
          });
        }
      } catch (err) {
        console.error('Error initPeerConnection', err);
      }
    },
    [roomId, stompClient]
  );

  // =========================================
  // 3. STOMP 구독(Offer/Answer/ICE) 수신 핸들러
  // =========================================
  useEffect(() => {
    // roomId가 존재해야 구독 가능
    if (!roomId || !stompClient) return;

    // Offer/Answer/ICE에 대한 메시지를 구독
    const subscription = stompClient.subscribe('/user/queue/matched', async (msg) => {
      const data = JSON.parse(msg.body);

      switch (data.type) {
        case 'offer': {
          // 오너가 아닌 측은 Offer 수신 → setRemote → Answer 생성
          if (!peerRef.current) {
            // 아직 PeerConnection이 없으므로 초기화
            await initPeerConnection(false);
          }
          if (!peerRef.current) return;

          await peerRef.current.setRemoteDescription(data.sdp);
          const answer = await peerRef.current.createAnswer();
          await peerRef.current.setLocalDescription(answer);

          // 서버로 Answer 전송
          stompClient.publish({
            destination: '/match/answer',
            body: JSON.stringify({ roomId, type: 'answer', sdp: answer }),
          });
          break;
        }

        case 'answer': {
          // 오너 측은 answer 수신 → setRemote
          if (!peerRef.current) return;
          await peerRef.current.setRemoteDescription(data.sdp);
          break;
        }

        case 'candidate': {
          // ICE candidate 수신 → peer.addIceCandidate
          if (!peerRef.current) return;
          try {
            await peerRef.current.addIceCandidate(data.candidate);
          } catch (error) {
            console.error('Error adding received ice candidate', error);
          }
          break;
        }

        default:
          break;
      }
    });

    // cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, stompClient, initPeerConnection]);

  // =========================================
  // 4. 통화(Offer 생성) 시작 (owner)
  // =========================================
  const startCall = useCallback(async () => {
    if (!matchingResult) return;
    // ownerYN === true면 initPeerConnection(true)
    await initPeerConnection(matchingResult.ownerYN);
  }, [matchingResult, initPeerConnection]);

  // =========================================
  // 5. 통화 종료
  // =========================================
  const endCall = useCallback(() => {
    // (1) PeerConnection 닫기
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    // (2) 오디오 스트림 중지
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);

    // (3) 필요하다면 서버에도 통화 종료 알림
    if (roomId && stompClient) {
      stompClient.publish({
        destination: '/match/endCall',
        body: JSON.stringify({ roomId }),
      });
    }
  }, [localStream, stompClient, roomId]);

  const value: CallContextValue = {
    localStream,
    remoteStream,
    startCall,
    endCall,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
