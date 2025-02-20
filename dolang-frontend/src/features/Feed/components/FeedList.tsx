import { useState, useEffect } from 'react';
import { FeedItem } from './FeedItem.tsx';
import { css } from '@emotion/react';
import { getFeedParticipants } from '../services/feedService.ts';
import { useFeedParticipaticipants } from '../hooks/useFeed.ts';

const FeedList = ({ feedId, isNativeLanguage }: { feedId: number; isNativeLanguage: boolean }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const { data: feedParticipationData, error: feedParticipationError } = useFeedParticipaticipants({
    feedId: feedId,
  });


useEffect(() => {
  const fetchFeedParticipation = async () => {
    try {
      setIsLoading(true);
      const response = await getFeedParticipants(feedId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  fetchFeedParticipation();
}, []);

if (feedParticipationError) {
  return (
    <section className="feed-list-container" css={feedListContainerStyle}>
      <p>피드 참여 데이터를 불러오는 중 오류가 발생했습니다.</p>
    </section>
  );
}

if (feedId === undefined) {
  return (
    <section className="feed-list-container" css={feedListContainerStyle}>
      <p>피드 정보가 없습니다.</p>
    </section>
  );
}

  return (
    <section className="feed-list-container" css={feedListContainerStyle}>
      {isLoading || feedParticipationData?.participants?.length === 0 ? (
        <>
          {isLoading ? <p>피드를 불러오는 중입니다...</p> : <p>참여자가 없습니다. 오늘의 첫 참여자가 되어 보세요!</p>}
        </>
      ) : (
        feedParticipationData?.participants?.map((feed) => (
          <>
            <FeedItem key={feed.postId} feedId={feedId} feedProps={feed} isNativeLanguage={isNativeLanguage} />
          </>
        ))
      )}
    </section>
  );
};

export default FeedList;
