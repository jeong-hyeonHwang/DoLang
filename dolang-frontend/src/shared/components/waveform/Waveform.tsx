import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { css } from '@emotion/react';
import { Volume1 } from 'lucide-react';

const Waveform = ({ audioSrc }: { audioSrc: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (isPlaying) waveRef.current?.play();
    else waveRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (waveContainerRef.current && !waveRef.current) {
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
    if (audioSrc) waveRef.current?.load(audioSrc);
    return () => waveRef.current?.destroy();
  }, [audioSrc]);

  const waveIndicatorStyle = css`
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 1rem;
  `;


  return (
    <div css={waveIndicatorStyle}>
      <Volume1 onClick={() => setIsPlaying((prev) => !prev)} />
      <div ref={waveContainerRef} />
    </div>
  );
};

export default Waveform;
