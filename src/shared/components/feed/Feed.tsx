import WaveIndicator from './WaveIndicator';

export type FeedProps = {
  user: User;
  content: Content;
  createdAt: Date;
};

const Feed = ({ user, content, createdAt }: FeedProps) => {
  return (
    <div>
      <div>{user.name}</div>
      <div>{content.text}</div>
      <WaveIndicator />
      <div>{createdAt.toLocaleDateString()}</div>
    </div>
  );
};

export default Feed;
