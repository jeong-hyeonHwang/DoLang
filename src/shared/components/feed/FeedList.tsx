import type { FeedProps } from './Feed';
import Feed from './Feed';

const FeedList = ({ feeds }: { feeds: FeedProps[] }) => {
  return (
    <div>
      {feeds.map((feed) => (
        <Feed key={feed.content.id} {...feed} />
      ))}
    </div>
  );
};

export default FeedList;
