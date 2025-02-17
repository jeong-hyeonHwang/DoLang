import { useState, useEffect } from 'react';
import { FeedItem } from './FeedItem.tsx';
import { css } from '@emotion/react';
import { getFeedParticipation } from '../services/feedService.ts';
import { FeedParticipant } from '../types/FeedParticipantsResponse.type.ts';
import { useFeedParticipation } from '../hooks/useFeed.ts';

const FeedList = ({ feedId }: { feedId: number }) => {
  const feedListContainerStyle = css`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 50vh;
    overflow-y: scroll;
    border-radius: 0.6rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) inset;
  `;

  if (feedId === undefined) {
    return (
      <section className="feed-list-container" css={feedListContainerStyle}>
        <p>피드 ID가 제공되지 않았습니다.</p>
      </section>
    );
  }

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: feedParticipationData, error: feedParticipationError } = useFeedParticipation({
    feedId: feedId.toString(),
  });

  useEffect(() => {
    const fetchFeedParticipation = async () => {
      try {
        setIsLoading(true);
        const response = await getFeedParticipation({ feedId: feedId.toString(), length: 5 });
        console.log(response);
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
      <section className="feed-list-container" css={feedListContainerStyle}>
        <p>오류가 발생했습니다.</p>
      </section>
    );
  }

  if (isLoading || feedParticipationData?.participants.length === 0) {
    return (
      <section className="feed-list-container" css={feedListContainerStyle}>
        {isLoading ? <p>피드를 불러오는 중입니다...</p> : <p>참여자가 없습니다. 오늘의 첫 참여자가 되어 보세요!</p>}
      </section>
    );
  }

  return (
    <section className="feed-list-container" css={feedListContainerStyle}>
      {feedParticipationData?.participants.map((feed) => (
        <>
          <FeedItem key={feed.postId} feedId={feed.postId} feedProps={feed} />
          <div
            onClick={() => {
              console.log(feed);
            }}
          ></div>
        </>
      ))}
    </section>
  );
};

export default FeedList;
