import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { nativeFeedTestData, nativeFeedSentenceTestData } from '../../features/Feed/tests/feedTestData.ts';
import { FeedSentenceResponse } from '../../features/Feed/types/FeedSentenceResponse.type.ts';
import Recorder from '../../features/Feed/components/Recorder.tsx';
import { useFeeds } from '../../features/Feed/hooks/useFeed.ts';
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

  const { data: feedListData } = useFeeds();
  useEffect(() => {
    if (feedListData) {
      console.log(feedListData);
    }
  }, [feedListData]);

  return (
    <>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <span>Language Picker</span>
        </div>
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          <p>{nativeFeedSentenceTestData.sentenceInfo.sentence}</p>
        </div>
        <Recorder />

        <FeedList feeds={feedListData} />
      </div>
    </>
  );
};

export default FeedView;
