import { css } from '@emotion/react';
import { Mic, Volume1 } from 'lucide-react';
import { useCallContext } from '../hooks/useCallContext';
import { usePeerContext } from '../hooks/usePeerContext';

export const CallWaveIndicator = () => {
  const { progress, handleRecord, containerRef, waveSurferRef } = useCallContext();
  const {
    peerId,
    callStatus,
    remotePeerId,
    audioRef,
    mediaConnectionRef,
    mediaStreamRef,
    peering,
    initiateCall,
    closeCall,
  } = usePeerContext();

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
    visibility: ${audioRef.current ? 'visible' : 'hidden'};
    align-items: center;
    justify-content: center;
  `;

  return (
    <>
      <div css={recorderStyle}>
        <Volume1 size={32} onClick={() => waveSurferRef.current?.play()} css={volumeStyle} />
        <div ref={containerRef} />
        <div onClick={initiateCall(remotePeerId)}>
          <Mic size={32} stroke="#fff" className="feed-sentence-button" css={feedButtonStyle} />
        </div>
        <div ref={mediaStreamRef} />
        {mediaConnectionRef && <span> {progress}</span>}
        <button onClick={() => closeCall()}>Close</button>
      </div>
    </>
  );
};
