import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useState } from 'react';
import { css } from '@emotion/react';
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

  const feedViewContainerStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  const [feedLang, setFeedLang] = useState<string>('ko');
  const { data } = useFeeds(feedLang as 'ko' | 'en');
  const handleLangChange = (value: string) => setFeedLang(value);

  return (
    <div className="feed-view-container" css={feedViewContainerStyle}>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <LanguagePicker value={feedLang} onChange={handleLangChange} />
        </div>
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          {data ? <p>{data.result?.feed.sentenceInfo.sentence}</p> : <p>로딩중...</p>}
        </div>
        <Recorder />
        {data ? <FeedList feedId={data.result?.feed.feedId} /> : <div>로딩중...</div>}
      </div>
    </div>
  );
};

export default FeedView;
