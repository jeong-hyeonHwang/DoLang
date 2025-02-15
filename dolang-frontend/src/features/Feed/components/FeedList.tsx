import { useState, useEffect } from 'react';
import { FeedItem } from './FeedItem.tsx';
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
    height: 50vh;
    overflow-y: scroll;
  `;
  const [feedParticipants, setFeedParticipants] = useState<FeedParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedParticipation = async () => {
      try {
        setIsLoading(true);
        const response = await getFeedParticipation({ feedId: '1', length: 5 });
        console.log(response);
        setFeedParticipants(response.participants);
        setIsLoading(false);
      } catch (error) {
        setError(error as string);
        setIsLoading(false);
      }
    };
    fetchFeedParticipation();
  }, []);

  if (error) {
    return (
      <section className="feed-list-section" css={feedListLayoutStyle}>
        <p>오류가 발생했습니다.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="feed-list-section" css={feedListLayoutStyle}>
        <p>피드를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (feedParticipants.length === 0) {
    return (
      <section className="feed-list-section" css={feedListLayoutStyle}>
        <p>참여자가 없습니다. 오늘의 첫 참여자가 되어 보세요!</p>
      </section>
    );
  }

  return (
    <section className="feed-list-section" css={feedListLayoutStyle}>
      {feedParticipants.map((feed) => (
        <FeedItem key={feed.postId} {...feed} />
      ))}
    </section>
  );
};

export default FeedList;
