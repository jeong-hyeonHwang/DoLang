import Waveform from '../../../shared/components/waveform/Waveform.tsx';
import { css } from '@emotion/react';
import { Heart, Bookmark } from 'lucide-react';
import { NameCard } from '../../../shared/components/nameCard/NameCard.tsx';
import { useRef, useState } from 'react';
import { FeedParticipant } from '../types/FeedParticipantsResponse.type.ts';
import { usePostBookmark, usePostHeart } from '../hooks/useReactions';

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

export const FeedItem = ({ feedId, feedProps }: { feedId: number; feedProps: FeedParticipant }) => {
  const { mutate: postBookmark } = usePostBookmark((data) => console.log(data));
  const { mutate: postHeart } = usePostHeart((data) => console.log(data));

  const handleBookmark = async (): Promise<void> => {
    setIsBookmarked((prev) => !prev);
    try {
      postBookmark({ feedId, postId: feedProps.postId });
    } catch (err) {
      console.error(err);
      setIsBookmarked((prev) => !prev);
    }
  };
  const handleHeart = async (): Promise<void> => {
    setIsHearted((prev) => !prev);
    try {
      postHeart({ feedId, postId: feedProps.postId });
    } catch (err) {
      console.error(err);
      setIsHearted((prev) => !prev);
    }
  };

  // 모국어 여부 확인
  const isNativeLanguage = useRef(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  return (
    <div css={feedStyle}>
      <NameCard userCountry={feedProps.country} style="compact" userImage={feedProps.profileImageUrl} />
      <div className="feed-content" css={feedContentStyle}>
        <Waveform audioSrc={feedProps.voiceUrl} />

        {isNativeLanguage.current ? (
          <>
            <Bookmark
              fill={isBookmarked ? 'green' : 'none'}
              stroke={isBookmarked ? 'green' : 'black'}
              onClick={handleBookmark}
            />
            {feedProps.bookmarkCount}
          </>
        ) : (
          <>
            <Heart fill={isHearted ? 'red' : 'none'} stroke={isHearted ? 'red' : 'black'} onClick={handleHeart} />
            {feedProps.heartCount}
          </>
        )}
      </div>
    </div>
  );
};
