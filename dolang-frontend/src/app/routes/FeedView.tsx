import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Mic } from 'lucide-react';
import {
  nativeFeedTestData,
  learningLanguageFeedTestData,
  nativeFeedSentenceTestData,
} from '../../features/Feed/tests/feedTestData.ts';
import { FeedParticipation } from '../../features/Feed/types/feedParticipation.type.ts';
import Waveform from '@/shared/components/waveform/Waveform.tsx';

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
  const [feedListData, setFeedListData] = useState<FeedParticipation[]>([]);

  useEffect(() => {
    setFeedListData(nativeFeedTestData.result);
  }, []);

  return (
    <>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <span>Language Picker</span>
        </div>
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          <p>{nativeFeedSentenceTestData.result.sentenceInfo.sentence}</p>
          <div className="feed-sentence-record-button" css={feedRecordButtonStyle}>
            <Mic size={32} stroke="#fff" />
          </div>
        </div>
        <FeedList feeds={feedListData} />
      </div>
    </>
  );
};

export default FeedView;
