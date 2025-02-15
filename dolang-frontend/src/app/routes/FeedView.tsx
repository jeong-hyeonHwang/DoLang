import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { nativeFeedTestData, nativeFeedSentenceTestData } from '../../features/Feed/tests/feedTestData.ts';
import { Feed, FeedSentenceResponse } from '../../features/Feed/types/FeedSentenceResponse.type.ts';
import Recorder from '../../features/Feed/components/Recorder.tsx';
import { useFeeds } from '../../features/Feed/hooks/useFeed.ts';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker.tsx';
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
    gap: 1rem;
  `;

  const feedSentenceSectionStyle = css`
    background-color: #d1d1d1;
    height: 3rem;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-radius: 1rem;
  `;

  const { data: data } = useFeeds('ko');
  useEffect(() => {
    if (data) {
      console.log(data);
      setFeedData(data.result.feed);
    }
  }, [data]);

  const [feedData, setFeedData] = useState<Feed>({
    date: '',
    feedId: 0,
    lang: '',
    isNativeFeed: false,
    sentenceInfo: { sentence: '', level: 'A1' },
    userParticipation: {},
  });
  return (
    <>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <LanguagePicker />
        </div>
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          <p>{feedData.sentenceInfo.sentence}</p>
        </div>
        <Recorder />

        <FeedList />
      </div>
    </>
  );
};

export default FeedView;
