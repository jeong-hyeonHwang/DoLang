import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  onPlay?: () => void;
  onPause?: () => void;
  playing?: boolean;
}

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const WaveformContainer = styled.div`
  flex: 1;
  height: 40px;
  margin: 0 16px;
  position: relative;
`;

const WaveformCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.progress}%;
  background: linear-gradient(90deg, #4caf50 1px, transparent 1px) repeat-x;
  background-size: 8px 100%;
  opacity: 0.7;
  pointer-events: none;
`;

export default function MyAudioPlayer({ url, onPlay, onPause, playing }: AudioPlayerProps) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', () => onPause?.());

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', () => onPause?.());
      }
    };
  }, [url, onPause]);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        onPause?.();
      } else {
        audioRef.current.play();
        onPlay?.();
      }
    }
  };

  return (
    <PlayerContainer>
      <PlayButton onClick={togglePlay}>{playing ? <Pause size={24} /> : <Play size={24} />}</PlayButton>
      <WaveformContainer>
        <WaveformCanvas ref={canvasRef} />
        <ProgressBar progress={progress} />
      </WaveformContainer>
    </PlayerContainer>
  );
}
