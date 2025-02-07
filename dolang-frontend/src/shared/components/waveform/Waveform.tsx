import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { css } from '@emotion/react';

const Waveform = ({ audioSrc }: { audioSrc: string }) => {
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveContainerRef.current && !waveRef.current) {
      waveRef.current = WaveSurfer.create({
        container: waveContainerRef.current,
        waveColor: '#959595',
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

    waveRef.current?.load(audioSrc);
  }, [audioSrc]);

  const waveIndicatorStyle = css`
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 1rem;
  `;

  return (
    <div css={waveIndicatorStyle}>
      <div ref={waveContainerRef} />
    </div>
  );
};

export default Waveform;
