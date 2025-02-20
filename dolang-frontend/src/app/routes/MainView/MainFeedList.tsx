import { useState, useEffect } from 'react';
import { FeedItem } from '@/features/Feed/components/FeedItem.tsx';
import { css } from '@emotion/react';
import { getFeedParticipants } from '@/features/Feed/services/feedService';
import { useFeedParticipaticipants } from '@/features/Feed/hooks/useFeed';

const MainFeedList = ({ feedId, isNativeLanguage }: { feedId: number; isNativeLanguage: boolean }) => {
  const feedListContainerStyle = css`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 50vh;
    border-radius: 0.6rem;
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
    if (feedParticipationError.message === '403') {
      return (
        <section className="feed-list-container" css={feedListContainerStyle}>
          <p>모국어 피드에 참여하시면 학습 언어 피드를 확인할 수 있습니다!</p>
        </section>
      );
    } else {
      return (
        <section className="feed-list-container" css={feedListContainerStyle}>
          <p>피드 참여 데이터를 불러오는 중 오류가 발생했습니다.</p>
        </section>
      );
    }
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

export default MainFeedList;
