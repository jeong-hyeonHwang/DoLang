import Waveform from '../../../shared/components/waveform/Waveform.tsx';
import { css } from '@emotion/react';
import { Heart, Bookmark, Volume1 } from 'lucide-react';
import { NameCard } from '../../../shared/components/nameCard/NameCard.tsx';
import { useRef, useState } from 'react';
import { FeedParticipant } from '../types/FeedParticipantsResponse.type.ts';

const feedStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const feedContentStyle = css`
  width: 100%;
  border: 1px solid #c1c1c1;
  border-radius: 0.6rem;
  padding: 0.6rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const FeedItem = (feedProps: FeedParticipant) => {
  // 모국어 여부 확인
  const isMotherTongue = useRef(false);
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div css={feedStyle}>
      <NameCard userCountry={feedProps.country} style="compact" userImage={feedProps.profileImageUrl} />
      <div className="feed-content" css={feedContentStyle}>
        <Volume1 />
        <Waveform audioSrc={feedProps.voiceUrl} />

        {isMotherTongue.current ? (
          <Bookmark
            fill={isChecked ? 'green' : 'none'}
            stroke={isChecked ? 'green' : 'black'}
            onClick={() => setIsChecked(!isChecked)}
          />
        ) : (
          <Heart
            fill={isChecked ? 'red' : 'none'}
            stroke={isChecked ? 'red' : 'black'}
            onClick={() => setIsChecked(!isChecked)}
          />
        )}
      </div>
    </div>
  );
};
