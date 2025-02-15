import { useState, useEffect } from 'react';
import type { FeedSentenceResponse } from '../types/FeedSentenceResponse.type.ts';
import Feed from './Feed.tsx';
import { css } from '@emotion/react';
import { getFeedParticipation } from '../services/feedService.ts';
import { FeedParticipant } from '../types/FeedParticipantsResponse.type.ts';

const FeedList = () => {
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
  const [feedParticipants, setFeedParticipants] = useState<FeedParticipant[]>([]);

  useEffect(() => {
    const fetchFeedParticipation = async () => {
      const response = await getFeedParticipation({ feedId: '1', length: 5 });
      console.log(response);
      setFeedParticipants(response.participants);
    };
    fetchFeedParticipation();
  }, []);

  return (
    <section className="feed-list-section" css={feedListLayoutStyle}>
      {feedParticipants.map((feed) => (
        <Feed
          key={feed.postId}
          {...feed}
          userInfo={{
            ...feed,
            interestingLanguageLevelId: '',
          }}
        />
      ))}
    </section>
  );
};

export default FeedList;
