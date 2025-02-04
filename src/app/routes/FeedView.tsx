import FeedList from '../../shared/components/feed/FeedList';
import { css } from '@emotion/react';
import { Mic } from 'lucide-react';
import { feedTestData } from '../../shared/components/feed/feedTestData';
import { FeedProps } from '../../shared/components/feed/Feed';

const FeedView = () => {
  const feedContainerStyle = css`
    min-width: 30rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  const feedHeaderStyle = css`
    display: flex;
    align-items: center;
  `;

  const feedSentenceSectionStyle = css`
    display: flex;
    background-color: #d1d1d1;
    padding: 1rem;
    border-radius: 1rem;
    height: 100%;
    max-height: 3rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  `;

  const feedRecordButtonStyle = css`
    background-color: #a11800;
    border-radius: 50%;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const testFeedContents = feedTestData;
  return (
    <>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <span>Language Picker</span>
        </div>
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          <p>Feed sentence</p>
          <div className="feed-sentence-record-button" css={feedRecordButtonStyle}>
            <Mic size={32} stroke="#fff" />
          </div>
        </div>
        <FeedList feeds={testFeedContents as FeedProps[]} />
      </div>
    </>
  );
};

export default FeedView;
