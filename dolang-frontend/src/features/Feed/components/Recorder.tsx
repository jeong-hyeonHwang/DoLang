import { css } from '@emotion/react';
import { Mic, StopCircle, Upload, Volume1 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { useVoiceUpload } from '../hooks/useVoiceUpload';
import { NameCard } from '@/shared/components/nameCard/NameCard';
interface RecorderProps {
  maxDuration?: number; // 최대 녹음 시간 (초)
  onRecordingComplete?: (blob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  feedId: number;
}

const Recorder: React.FC<RecorderProps> = ({
  maxDuration = 10,
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  feedId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const recordingsRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<RecordPlugin | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const {
    mutate: uploadVoice,
    isPending: isUploading,
    isSuccess: uploadSuccess,
    error: uploadError,
  } = useVoiceUpload();

  const recorderContainerStyle = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 48px;
    gap: 0.5rem;
  `;

  const recorderStyle = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 48px;
    border: 1px solid #d1d1d1;
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    align-items: center;
    border-radius: 1rem;
    position: relative;
    gap: 8px;
    padding: 0 8px;
  `;

  const controlsContainerStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  `;

  const progressStyle = css`
    font-size: 14px;
    color: #666;
  `;

  const submitButtonStyle = css`
    background-color: #007aff;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 0.5rem;
    font-size: 14px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
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
    try {
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
        const minutes = Math.floor(progressElapsed / 60);
        const seconds = Math.floor(progressElapsed % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setProgress(formattedTime);

        if (progressElapsed >= maxDuration) {
          handleStopRecording();
        }
      });

      // 녹음 끝나면 녹음된 파일 재생
      recordPluginRef.current.on('record-end', (blob: Blob) => {
        const recordedUrl = URL.createObjectURL(blob);
        waveSurferRef.current?.load(recordedUrl);
        setRecordedBlob(blob);
        onRecordingComplete?.(blob);
      });

      // 재생 상태 관리
      waveSurferRef.current.on('play', () => setIsPlaying(true));
      waveSurferRef.current.on('pause', () => setIsPlaying(false));
      waveSurferRef.current.on('finish', () => setIsPlaying(false));
    } catch (err) {
      console.error('WaveSurfer 초기화 실패:', err);
      setError('오디오 초기화에 실패했습니다.');
    }
  };

  const handleStartRecording = async () => {
    try {
      await recordPluginRef.current?.startRecording();
      setIsRecording(true);
      setError(null);
      onRecordingStart?.();
    } catch (err) {
      console.error('녹음 시작 실패:', err);
      setError('마이크 접근 권한이 필요합니다.');
    }
  };

  const handleStopRecording = () => {
    if (recordPluginRef.current?.isRecording() || recordPluginRef.current?.isPaused()) {
      recordPluginRef.current.stopRecording();
      setIsRecording(false);
      onRecordingStop?.();
    }
  };

  const handlePlayPause = () => {
    if (!waveSurferRef.current) return;

    if (isPlaying) {
      waveSurferRef.current.pause();
    } else {
      waveSurferRef.current.play();
    }
  };

  const handleSubmit = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], `${Date.now()}.ogg`);
      console.log(feedId);
      uploadVoice({ feedId, file });
      if (uploadSuccess) {
        console.log('업로드 성공');
      }
    }
  };
  useEffect(() => {
    if (uploadSuccess) {
      setUploadCompleted(true);
    }
  }, [uploadSuccess]);
  // 초기화
  useEffect(() => {
    createWaveSurfer();
    return () => {
      if (waveSurferRef.current) waveSurferRef.current.destroy();
    };
  }, []);

  if (error) {
    return (
      <div css={recorderStyle}>
        <span
          css={css`
            color: #a11800;
          `}
        >
          {error}
        </span>
      </div>
    );
  }
  const user = sessionStorage.getItem('user');
  const userInfo = user ? JSON.parse(user) : null;

  return (
    <>
      {user?.nickname && (
        <div css={recorderContainerStyle}>
          <NameCard
            userImage={userInfo?.profileImageUrl}
            userCountry={userInfo?.country}
            userNickname={userInfo?.nickname}
            style="compact"
          />
          <div css={recorderStyle}>
            <div
              css={css`
                justify-self: start;
              `}
            >
              {recordedBlob && !isRecording && (
                <Volume1
                  size={32}
                  onClick={handlePlayPause}
                  css={[
                    volumeStyle,
                    isPlaying &&
                      css`
                        color: #a11800;
                      `,
                  ]}
                />
              )}
              {isRecording && <span css={progressStyle}>{progress}</span>}
            </div>

            <div
              css={css`
                position: relative;
                width: 100%;
              `}
            >
              <div ref={recordingsRef} />
              <div ref={containerRef} />
            </div>
          </div>

          <div css={controlsContainerStyle}>
            {!uploadCompleted && recordedBlob && !isRecording && (
              <button onClick={handleSubmit} css={submitButtonStyle} disabled={!recordedBlob}>
                <Upload />
              </button>
            )}
            <div onClick={isRecording ? handleStopRecording : handleStartRecording}>
              {isRecording ? (
                <StopCircle size={32} stroke="#fff" css={feedButtonStyle} />
              ) : (
                <Mic size={32} stroke="#fff" css={feedButtonStyle} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Recorder;
