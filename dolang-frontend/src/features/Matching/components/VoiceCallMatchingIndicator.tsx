import { useState, CSSProperties } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

const VoiceCallMatchingIndicator = () => {
  const [color, setColor] = useState('#66e18d');

  return (
    <div className="pulse-loader">
      <PulseLoader
        color={color}
        cssOverride={override}
        size={20}
        speedMultiplier={0.5}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default VoiceCallMatchingIndicator;
