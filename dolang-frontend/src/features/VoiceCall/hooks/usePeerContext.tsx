import React, { useRef, useState, createContext, useContext } from 'react';
import Peer, { MediaConnection } from 'peerjs';

interface PeerContextValue {
  peerId: string;
  remotePeerId: string;
  callStatus: string;
  audioRef: React.RefObject<HTMLAudioElement>;
  mediaConnectionRef: React.RefObject<MediaConnection | null>;
  mediaStreamRef: React.RefObject<MediaStream>;
  peering: () => void;
  initiateCall: (peerIdToCall: string) => void;
  closeCall: () => void;
  setPeer: (peerId: string) => void;
  setRemotePeer: (peerId: string) => void;
}

const peerContext = createContext<PeerContextValue | null>(null);

export function usePeerContext() {
  const context = useContext(peerContext);
  if (!context) {
    throw new Error('usePeerContext must be used within a PeerContextProvider');
  }
  return context;
}

export const PeerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [callStatus, setCallStatus] = useState('');

  const peer = useRef<Peer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaConnectionRef = useRef<MediaConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const peering = () => {
       peer.current = new Peer(undefined, {
         host: 'peer.imhyuk.kr',
         port: 443,
         pingInterval: 5000,
         path: '/',
         secure: true,
         config: {
           iceServers: [
             { url: 'stun:stun.l.google.com:19302' },
             { url: 'turn:13.125.99.196:3478', username: 'user', credential: '1234' },
           ],
           sdpSemantics: 'unified-plan',
         },
         debug: 3,
       });

    // Emitted when a connection to the PeerServer is established.
    peer.current.on('open', (id) => {
      // brokering ID of the peer
      setPeerId(id);
      console.log('Peer ID:', id);
      setCallStatus('피어링 성공');
    });

    // Emitted when the peer is destroyed and can no longer accept or create any new connections
    peer.current.on('close', () => {
      peer.current?.destroy();
      console.log(`Peer ${peerId} Closed`);
    });

    // Emitted when a remote peer attempts to call you.
    peer.current.on('call', (mediaConnection) => {
      mediaConnectionRef.current = mediaConnection;
      setEventsOnMediaConnection(mediaConnection);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          mediaConnection.answer(stream);
        })
        .catch((err) => {
          console.error('Answer fails', err);
          setCallStatus(err.toString());
        });
    });

    peer.current.on('error', (err) => {
      setCallStatus(err.toString());
    });
  };

  const initiateCall = (peerIdToCall) => {
    if (peer.current) {
      const currentPeer = peer.current;
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaConnection = currentPeer.call(peerIdToCall, stream);
          mediaConnectionRef.current = mediaConnection;
          setEventsOnMediaConnection(mediaConnection);
          mediaStreamRef.current = stream;
        })
        .catch((err) => {
          console.error('Call fails', err);
          setCallStatus(err.toString());
        });
    }
  };

  const setEventsOnMediaConnection = (mediaConnection) => {
    setCallStatus('통화중');
    mediaConnection.on('stream', (remoteStream) => {
      console.log('오디오 설정됨:', remoteStream);
      if (audioRef.current) {
        audioRef.current.srcObject = remoteStream;
      }
    });
    mediaConnection.on('error', (err) => {
      console.error('mediaConnection error', err);
    });
    mediaConnection.on('close', () => {
      console.log('mediaConnection closed');
      closeCall();
    });
  };

  const closeCall = () => {
    if (mediaConnectionRef.current) {
      mediaConnectionRef.current.close();
    }
    setCallStatus('');
    setRemotePeerId('');
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const setPeer = (peerId) => {
    setPeerId(peerId);
  };

  const setRemotePeer = (peerId) => {
    setRemotePeerId(peerId);
  };

  const value = {
    peerId,
    remotePeerId,
    callStatus,
    audioRef,
    mediaConnectionRef,
    mediaStreamRef,
    peering,
    initiateCall,
    closeCall,
    setPeer,
    setRemotePeer,
  };

  return <peerContext.Provider value={value}>{children}</peerContext.Provider>;
};
