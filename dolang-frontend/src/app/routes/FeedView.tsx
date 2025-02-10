import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Mic } from 'lucide-react';
import { nativeFeedTestData, nativeFeedSentenceTestData } from '../../features/Feed/tests/feedTestData.ts';
import useFeedParticipation from '@/features/Feed/hooks/useFeedParticipation.ts';
import { FeedParticipation } from '../../features/Feed/types/feedParticipation.type.ts';
import Recorder from '@/features/Feed/components/Recorder.tsx';

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
    background-color: #e7e7e7;
    padding: 1rem;
    border-radius: 0.8rem;
    width: 100%;
    height: 100%;
    max-height: 4rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  `;

  const userParticipationSectionStyle = css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    gap: 1rem;
  `;
  const [feedListData, setFeedListData] = useState<FeedParticipation[]>([]);
  // const { startRecording, stopRecording, isRecording } = useFeedParticipation();

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
        </div>
        <div className="user-participation-section" css={userParticipationSectionStyle}>
          <Recorder />
        </div>
        <FeedList feeds={feedListData} />
      </div>
    </>
  );
};

export default FeedView;
