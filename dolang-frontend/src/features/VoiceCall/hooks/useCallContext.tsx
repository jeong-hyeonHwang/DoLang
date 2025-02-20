import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { postEndCall, postStartCall } from '../services/callService';

interface CallContextValue {
  hour: number;
  minute: number;
  second: number;
  isCallEnded: boolean;
  endCall: () => void;
  callId: number;
  setCallId: (callId: number) => void;
  hours: number;
  minutes: number;
  seconds: number;
}

const CallContext = createContext<CallContextValue | null>(null);

export function useCallContext() {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCallContext must be used within a CallContextProvider');
  return context;
}

export const CallContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [callId, setCallId] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 총 통화 시간 표시
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);
    }, 1000);

    if (isCallEnded) clearInterval(timer);

    return () => clearInterval(timer);
  }, [isCallEnded]);

  const endCall = () => {
    setIsCallEnded(true);
    postEndCall(callId);
  };

  const value = {
    hour: 0,
    minute: 0,
    second: 0,
    isCallEnded,
    endCall,
    hours,
    minutes,
    seconds,
    callId,
    setCallId,
  };
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
