import type { FeedSentenceResponse } from '../types/FeedSentenceResponse.type.ts';
import Feed from './Feed.tsx';
import { css } from '@emotion/react';

const FeedList = ({ feeds }: { feeds: FeedSentenceResponse[] }) => {
  const feedListLayoutStyle = css`
    padding: 1rem;
    margin: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 50vh;
    overflow-y: scroll;
    border: 1px solid #d1d1d1;
    border-radius: 1rem;
  `;

  return (
    <section className="feed-list-section" css={feedListLayoutStyle}>
      {feeds.map((feed) => (
        <Feed
          key={feed.feedId}
          {...feed}
          userInfo={{
            ...feed.userParticipation,
            interestingLanguageLevelId: '',
          }}
        />
      ))}
    </section>
  );
};

export default FeedList;
