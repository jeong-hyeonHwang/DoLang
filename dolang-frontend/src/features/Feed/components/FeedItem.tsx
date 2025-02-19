import Waveform from '../../../shared/components/waveform/Waveform.tsx';
import { css } from '@emotion/react';
import { Heart, Bookmark } from 'lucide-react';
import { NameCard } from '../../../shared/components/nameCard/NameCard.tsx';
import { FeedParticipant } from '../types/FeedParticipantsResponse.type.ts';
import { usePostBookmark, usePostHeart } from '../hooks/useFeedReactions.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const feedStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const feedContentStyle = css`
  width: 100%;
  height: 100%;
  border: 1px solid #c1c1c1;
  border-radius: 0.6rem;
  padding: 0.6rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const feedReactionStyle = css`
  width: 2.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.2rem;
`;

export const FeedItem = ({
  feedId,
  feedProps,
  isNativeLanguage,
}: {
  feedId: number;
  feedProps: FeedParticipant;
  isNativeLanguage: boolean;
}) => {
  const { mutate: postBookmark } = usePostBookmark();
  const { mutate: postHeart } = usePostHeart();
  const handleBookmark = async (): Promise<void> => {
    postBookmark({ feedId, postId: feedProps.postId });
  };
  const handleHeart = async (): Promise<void> => {
    postHeart({ feedId, postId: feedProps.postId });
  };

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  //
  // 모국어 여부 확인
  return (
    <div css={feedStyle}>
      <NameCard userCountry={feedProps.country} style="compact" userImage={feedProps.profileImageUrl} />
      <div className="feed-content" css={feedContentStyle}>
        <Waveform audioSrc={feedProps.voiceUrl} />
        {user?.nickname && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '0.2rem',
              justifyContent: 'flex-end',
            }}
          >
            {isNativeLanguage ? (
              <div css={feedReactionStyle}>
                <Heart
                  fill={feedProps.isUserHearted ? 'red' : 'none'}
                  stroke={feedProps.isUserHearted ? 'red' : 'black'}
                  onClick={handleHeart}
                />
                {feedProps.heartCount}
              </div>
            ) : (
              <div css={feedReactionStyle}>
                <Bookmark
                  fill={feedProps.isUserBookmarked ? 'green' : 'none'}
                  stroke={feedProps.isUserBookmarked ? 'green' : 'black'}
                  onClick={handleBookmark}
                />
                {feedProps.bookmarkCount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};