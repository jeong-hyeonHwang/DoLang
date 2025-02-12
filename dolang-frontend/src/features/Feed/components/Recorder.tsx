import { css } from '@emotion/react';
import { Mic, StopCircle, Volume1 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

const Recorder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const recordingsRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState('00:00');

  const recorderStyle = css`
    width: 100%;
    height: 48px;
    border: 1px solid #d1d1d1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 1rem;
  `;

  const feedButtonStyle = css`
    background-color: #a11800;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const volumeStyle = css`
    width: 40px;
    height: 40px;
    cursor: pointer;
    padding: 0.5rem;
    visibility: ${recordingsRef.current ? 'visible' : 'hidden'};
    align-items: center;
    justify-content: center;
  `;

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

  return (
    <div css={recorderStyle}>
      <Volume1 size={32} onClick={() => waveSurferRef.current?.play()} css={volumeStyle} />
      <div ref={containerRef} />
      <div onClick={handleRecord}>
        {isRecording ? (
          <StopCircle size={32} stroke="#fff" className="feed-sentence-button" css={feedButtonStyle} />
        ) : (
          <Mic size={32} stroke="#fff" className="feed-sentence-button" css={feedButtonStyle} />
        )}
      </div>
      <div ref={recordingsRef} />
      {isRecording && <span> {progress}</span>}
    </div>
  );
};

export default Recorder;
