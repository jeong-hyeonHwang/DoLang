import { css } from '@emotion/react';
import { Timer } from 'lucide-react';
import { useCallContext } from '../hooks/useCallContext';
import { useEffect } from 'react';

export const CallTimer = () => {
  const { hours, minutes, seconds } = useCallContext();
  const formattedMinute = minutes.toString().padStart(2, '0');
  const formattedSecond = seconds.toString().padStart(2, '0');
  useEffect(() => {}, [hours, minutes, seconds]);

  return (
    <div className="end-call-timer-wrapper" css={timerStyle}>
      <Timer />
      <div>
        {hours > 0 && <span>{hours}:</span>}
        <span>{formattedMinute}:</span>
        <span>{formattedSecond}</span>
      </div>
    </div>
  );
};

const timerStyle = css`
  position: absolute;
  left: 1rem;
  top: 1rem;
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  & span,
  svg {
    color: #fff;
  }
`;
