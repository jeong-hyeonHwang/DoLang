import { useState, useEffect } from 'react';
import { FeedItem } from './FeedItem.tsx';
import { feedListContainerBase, feedListVariants } from './baseFeedListStyles.tsx';
import { getFeedParticipants } from '../services/feedService.ts';
import { useFeedParticipaticipants } from '../hooks/useFeed.ts';

interface BaseFeedListProps {
  feedId: number;
  isNativeLanguage: boolean;
  variant?: 'default' | 'main';
}

const BaseFeedList = ({ feedId, isNativeLanguage, variant = 'default' }: BaseFeedListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: feedParticipationData, error: feedParticipationError } = useFeedParticipaticipants({
    feedId: feedId,
  });

  useEffect(() => {
    const fetchFeedParticipation = async () => {
      try {
        setIsLoading(true);
        const response = await getFeedParticipants({ feedId, length: 5 });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchFeedParticipation();
  }, []);

  if (feedParticipationError) {
    return (
      <section className="feed-list-container" css={[feedListContainerBase, feedListVariants[variant]]}>
        <p>피드 참여 데이터가 없습니다. 피드에 참여해 보세요! </p>
      </section>
    );
  }

  if (feedId === undefined) {
    return (
      <section className="feed-list-container" css={[feedListContainerBase, feedListVariants[variant]]}>
        <p>피드 정보가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="feed-list-container" css={[feedListContainerBase, feedListVariants[variant]]}>
      {isLoading || feedParticipationData?.participants?.length === 0 ? (
        <>
          {isLoading ? <p>피드를 불러오는 중입니다...</p> : <p>참여자가 없습니다. 오늘의 첫 참여자가 되어 보세요!</p>}
        </>
      ) : (
        feedParticipationData?.participants?.map((feed) => (
          <FeedItem key={feed.postId} feedId={feedId} feedProps={feed} isNativeLanguage={isNativeLanguage} />
        ))
      )}
    </section>
  );
};

export default BaseFeedList;
