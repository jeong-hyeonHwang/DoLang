import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

interface CallContextValue {
  isRecording: boolean;
  progress: string;
  recordingsRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  waveSurferRef: React.RefObject<WaveSurfer>;
  handleRecord: () => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const recordingsRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState('00:00');

  const createWaveSurfer = () => {
    // 이전 인스턴스 제거
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }
    if (!containerRef.current) return;

    // 인스턴스 생성
    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#959595',
      progressColor: '#000000',
      width: 240,
      height: 48,
      barWidth: 5,
      barGap: 1,
      barRadius: 5,
      dragToSeek: true,
      cursorColor: '#ffffff0',
    });

    // Record Plugin 등록
    recordPluginRef.current = waveSurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: true,
        continuousWaveform: true,
        continuousWaveformDuration: 10,
      })
    );

    // 녹음 진행률
    recordPluginRef.current?.on('record-progress', (time: number) => {
      const progressElapsed = time / 1000;
      const seconds = Math.floor((time % 60000) / 1000);
      const formattedTime = seconds < 10 ? '0' + seconds + '"' : seconds + '"';
      setProgress(formattedTime);

      if (progressElapsed >= 10) {
        if (recordPluginRef.current?.isRecording() || recordPluginRef.current?.isPaused()) {
          recordPluginRef.current.stopRecording();
          setIsRecording(false);
        }
      }
    });

    // 녹음 끝나면 녹음된 파일 재생
    recordPluginRef.current.on('record-end', (blob: Blob) => {
      if (recordingsRef.current) {
        const recordedUrl = URL.createObjectURL(blob);
        waveSurferRef.current?.load(recordedUrl);
      }
    });
  };

  // 초기화
  useEffect(() => {
    createWaveSurfer();
    return () => {
      if (waveSurferRef.current) waveSurferRef.current.destroy();
    };
  }, []);

  // 녹음 시작/정지
  const handleRecord = async () => {
    if (recordPluginRef.current && (recordPluginRef.current.isRecording() || recordPluginRef.current.isPaused())) {
      // 이미 녹음 중이면 녹음 중지
      recordPluginRef.current.stopRecording();
      setIsRecording(false);
    } else {
      try {
        await recordPluginRef.current?.startRecording();
        setIsRecording(true);
      } catch (err) {
        console.error('녹음 시작 실패:', err);
      }
    }
  };
  const value = {
    isRecording,
    progress,
    recordingsRef,
    containerRef,
    waveSurferRef,
    handleRecord,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export default useCallContext;
