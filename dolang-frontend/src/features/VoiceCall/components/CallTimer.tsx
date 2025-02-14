import { Timer } from 'lucide-react';

export const CallTimer = () => (
  <div
    className="end-call-timer-wrapper"
    style={{ display: 'flex', alignSelf: 'flex-end', gap: '0.5rem', padding: '1rem' }}
  >
    <Timer />
    <div>time</div>
  </div>
);
