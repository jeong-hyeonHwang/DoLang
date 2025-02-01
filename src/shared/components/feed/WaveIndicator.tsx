import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveIndicator = () => {
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveContainerRef.current && !waveRef.current) {
      waveRef.current = WaveSurfer.create({
        container: waveContainerRef.current,
        waveColor: '#959595',
        progressColor: '#000000',
        url: '/test.wav',
        barWidth: 5,
        barGap: 1,
        barRadius: 5,
      });
    }
    return () => {
      waveRef.current?.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={waveContainerRef} />
      <button onClick={() => waveRef.current?.play()}>Play</button>
    </div>
  );
};

export default WaveIndicator;
