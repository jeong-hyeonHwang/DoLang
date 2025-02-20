import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { css } from '@emotion/react';
import { Volume1 } from 'lucide-react';

const Waveform = ({ audioSrc }: { audioSrc: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveContainerRef.current) return;

    if (waveRef.current) {
      waveRef.current.destroy();
      waveRef.current = null;
    }

    if (waveContainerRef.current) {
      waveRef.current = WaveSurfer.create({
        container: waveContainerRef.current,
        waveColor: '#959595',
        url: audioSrc,
        width: 80,
        height: 48,
        progressColor: '#000000',
        barWidth: 5,
        barGap: 1,
        barRadius: 5,
        dragToSeek: true,
        autoplay: false,
        cursorColor: '#ffffff0',
      });
    }

    waveRef.current?.on('ready', () => setIsReady(true));
    waveRef.current?.on('play', () => setIsPlaying(true));
    waveRef.current?.on('pause', () => setIsPlaying(false));
    waveRef.current?.on('finish', () => setIsPlaying(false));

    waveRef.current?.load(audioSrc);

    return () => waveRef.current?.destroy();
  }, [audioSrc]);

  const waveIndicatorStyle = css`
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 1rem;
  `;

  const playButtonStyle = css`
    cursor: pointer;
    color: ${isPlaying ? '#959595' : ' #000000'};
  `;

  const handlePlayPause = () => {
    if (!waveRef.current || !isReady) return;

    if (isPlaying) {
      waveRef.current.pause();
    } else {
      waveRef.current.play().catch((e) => {
        console.error('Playback error:', e);
      });
    }
  };
  return (
    <div css={waveIndicatorStyle}>
      <Volume1 onClick={handlePlayPause} css={playButtonStyle} />
      <div ref={waveContainerRef} />
    </div>
  );
};

export default Waveform;
