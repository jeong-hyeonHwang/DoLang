import React, { useRef, useState, createContext, useContext } from 'react';
import Peer, { MediaConnection, DataConnection } from 'peerjs';

interface PeerContextValue {
  peerId: string;
  remotePeerId: string;
  callStatus: string;
  messages: string[];
  audioRef: React.RefObject<HTMLAudioElement>;
  mediaConnectionRef: React.RefObject<MediaConnection | null>;
  dataConnectionRef: React.RefObject<MediaConnection | null>;
  mediaStreamRef: React.RefObject<MediaStream>;
  peering: () => void;
  initiateCall: (peerIdToCall: string) => void;
  sendMessage: (message: string) => void;
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
  const [messages, setMessages] = useState<string[]>([]);

  const peer = useRef<Peer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaConnectionRef = useRef<MediaConnection | null>(null);
  const dataConnectionRef = useRef<DataConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const peering = () => {
    peer.current = new Peer();

    // Emitted when a connection to the PeerServer is established.
    peer.current.on('open', (id) => {
      // brokering ID of the peer
      setPeerId(id);
      console.log('Peer ID:', id);
      setCallStatus('피어링 성공');
    });

    peer.current.on('connection', (conn) => {
      console.log('데이터 연결 수립');
      dataConnectionRef.current = conn;
      setEventsOnDataConnection(conn);
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
    console.log(peerIdToCall);

    if (peer.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaConnection = peer.current!.call(peerIdToCall, stream);
          mediaConnectionRef.current = mediaConnection;
          console.log('mediaStream' + mediaConnection);
          setEventsOnMediaConnection(mediaConnection);
          mediaStreamRef.current = stream;
        })
        .catch((err) => {
          console.error('Call fails', err);
          setCallStatus(err.toString());
        });

      const dataConnection = peer.current.connect(peerIdToCall);
      dataConnectionRef.current = dataConnection;
      setEventsOnDataConnection(dataConnection);
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

  const setEventsOnDataConnection = (dataConnection: DataConnection) => {
    dataConnection.on('data', (message: string) => {
      console.log('메시지 수신:', message);
      setMessages((prev) => [...prev, `상대방: ${message}`]);
    });

    dataConnection.on('close', () => {
      console.log('DataConnection closed');
      dataConnectionRef.current = null;
    });

    dataConnection.on('error', (err) => {
      console.error('DataConnection error', err);
    });
  };

  const sendMessage = (message: string) => {
    if (dataConnectionRef.current && dataConnectionRef.current.open) {
      dataConnectionRef.current.send(message);
      setMessages((prev) => [...prev, `나: ${message}`]);
    } else {
      console.warn('데이터 연결이 없습니다.');
    }
  };

  const closeCall = () => {
    if (mediaConnectionRef.current) mediaConnectionRef.current.close();
    if (dataConnectionRef.current) dataConnectionRef.current.close();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    setCallStatus('');
    setRemotePeerId('');
    setMessages([]);
  };

  const setPeer = (peerId) => setPeerId(peerId);
  const setRemotePeer = (peerId) => setRemotePeerId(peerId);

  const value = {
    peerId,
    remotePeerId,
    callStatus,
    messages,
    audioRef,
    mediaConnectionRef,
    dataConnectionRef,
    mediaStreamRef,
    peering,
    initiateCall,
    sendMessage,
    closeCall,
    setPeer,
    setRemotePeer,
  };

  return <peerContext.Provider value={value}>{children}</peerContext.Provider>;
};
