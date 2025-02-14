import { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react';
import { Client } from '@stomp/stompjs';
import { usePeerContext } from '../../VoiceCall/hooks/usePeerContext';
import { MatchedUser, MatchingResult } from '../types/Matching.type';

interface StompClientProviderProps {
  children: ReactNode;
}

export interface StompContextValue {
  stompClient: Client | null;
  peerId: string;

  isConnected: boolean;
  isMatching: boolean;
  matchedUser: MatchedUser | null;
  matchingResult: MatchingResult | null;
  connectionError: string;

  connect: (token: string) => void;
  disconnect: () => void;

  startMatching: () => void;
  cancelMatching: () => void;
}

const StompClientContext = createContext<StompContextValue | null>(null);

export function useStompClientContext() {
  const context = useContext(StompClientContext);
  if (!context) {
    throw new Error('useStompClientContext must be used within a StompClientProvider');
  }
  return context;
}

export const StompClientProvider = ({ children }: StompClientProviderProps) => {
  const stompClientRef = useRef<Client | null>(null);
  const [token, setToken] = useState('');

  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);
  const [connectionError, setConnectionError] = useState<string>('');
  const { peerId, setRemotePeer, peering } = usePeerContext();

  const sendMessage = useCallback(
    (destination: string) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: `/match${destination}`,
          body: JSON.stringify({ peerId: peerId }),
        });
      }
    },
    [peerId]
  );

  // 연결 시도 콜백
  const connect = useCallback(
    (accessToken: string) => {
      if (stompClientRef.current) {
        setConnectionError('Already connected');
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }

      setToken(accessToken);

      const MATCHING_SERVER_URL = import.meta.env.VITE_MATCHING_SERVER_URL;

      // 새 stompClient 인스턴스 생성
      const stompClient = new Client({
        brokerURL: `wss://${MATCHING_SERVER_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          peering();
          console.log('Connected');
          setIsConnected(true);
          setConnectionError('');

          stompClient.subscribe(`/user/queue/matched`, (message) => {
            const matchingResult = JSON.parse(message.body);
            setMatchingResult(matchingResult);
            setRemotePeer(matchingResult.matchedUser.peerId);
            setMatchedUser(matchingResult.matchedUser);
            setIsMatching(false);
            console.log(matchingResult);
            console.log('Matched with user:', matchingResult.matchedUser);
          });
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);

          // 서버에서 받은 에러 메시지를 사용자에게 표시
          setConnectionError(frame.headers['message'] || 'Connection error');
          setIsConnected(false);

          // 서버에서 에러 메시지가 없다면 기본 메시지 제공
          if (!frame.headers['message']) {
            setConnectionError('Authentication failed or invalid token.');
          }
        },
        onWebSocketClose: () => {
          setIsConnected(false);
          setMatchedUser(null);
          setIsMatching(false);
        },
      });

      stompClientRef.current = stompClient;
      stompClient.activate();
    },
    [peering, setRemotePeer]
  );

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      sendMessage('/stop');
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    }
  }, [sendMessage]);

  const startMatching = useCallback(() => {
    if (stompClientRef.current && !isMatching && peerId) {
      setIsMatching(true);
      sendMessage('/start');
    }
  }, [isMatching, sendMessage, peerId]);

  const cancelMatching = useCallback(() => {
    if (stompClientRef.current && isMatching) {
      setIsMatching(false);
      sendMessage('/stop');
    }
  }, [isMatching, sendMessage]);

  useEffect(() => {
    return () => {
      console.log('unmount');
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const value: StompContextValue = {
    stompClient: stompClientRef.current,
    peerId,
    isConnected,
    isMatching,
    matchingResult,
    matchedUser,
    connectionError,
    connect,
    disconnect,
    startMatching,
    cancelMatching,
  };

  return <StompClientContext.Provider value={value}>{children}</StompClientContext.Provider>;
};
