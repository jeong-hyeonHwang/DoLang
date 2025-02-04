import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { css } from '@emotion/react';

interface WaveIndicatorProps {
  audioSrc: string;
}

const WaveIndicator = ({ audioSrc }: WaveIndicatorProps) => {
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveContainerRef.current && !waveRef.current) {
      waveRef.current = WaveSurfer.create({
        container: waveContainerRef.current,
        waveColor: '#959595',
        width: 240,
        progressColor: '#000000',
        url: audioSrc,
        barWidth: 5,
        barGap: 1,
        barRadius: 5,
        dragToSeek: true,
        autoplay: false,
        cursorColor: '#ffffff0',
      });
    }
    return () => waveRef.current?.destroy();
  }, [audioSrc]);

  const waveIndicatorStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
  `;

  return (
    <div css={waveIndicatorStyle}>
      <div ref={waveContainerRef} />
    </div>
  );
};

export default WaveIndicator;
