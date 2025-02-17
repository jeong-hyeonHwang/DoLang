import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useState } from 'react';
import { css } from '@emotion/react';
import Recorder from '../../features/Feed/components/Recorder.tsx';
import { useFeeds, useFeedParticipation } from '../../features/Feed/hooks/useFeed.ts';
import { useMyFeed } from '../../features/Feed/hooks/useFeed.ts';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker.tsx';
import { ClipLoader } from 'react-spinners';
import { FeedCard } from './SavedContents/AudioFeed.tsx';
import { useUser } from '@/api/utils/useUser.ts';

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
    align-items: center;
  `;

  const [feedLang, setFeedLang] = useState<string>('en');
  const { data: feedData, error: feedError } = useFeeds(feedLang as 'ko' | 'en');
  const { data: myFeedData, error: myFeedError } = useMyFeed({ lang: feedLang as 'ko' | 'en' });
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const handleLangChange = (value: string) => setFeedLang(value);

  // 에러가 있을 경우 에러 메시지만 렌더링
  if (feedError) {
    return (
      <div className="feed-view-container" css={feedViewContainerStyle}>
        <p>피드 데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // data가 아직 없을 경우 로딩중 메시지만 렌더링
  if (!feedData) {
    return (
      <div className="feed-view-container" css={feedViewContainerStyle}>
        <ClipLoader color="#000" size={40} />
        <p>피드를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 모국어 피드 참여 여부에 따라 컴포넌트를 반환
  const renderNativeFeedParticipation = () => {
    if (myFeedData) {
      if (myFeedData.result?.content.length > 0) {
        return (
          <div>
            <FeedCard item={myFeedData.result?.content[0]} isNativeLanguage={feedData.result?.feed.isNativeFeed} />
          </div>
        );
      } else {
        return <>아직 피드에 참여하지 않았습니다. 피드에 참여해 보세요!</>;
      }
    }
    return <>아직 피드에 참여하지 않았습니다. 피드에 참여해 보세요!</>;
  };

  // 학습 피드 참여 여부에 따라 컴포넌트를 반환
  const renderTargetFeedParticipation = () => {
    if (myFeedData) {
      if (myFeedData.result?.content.length > 0) {
        return (
          <div>
            <FeedCard item={myFeedData.result?.content[0]} isNativeLanguage={feedData.result?.feed.isNativeFeed} />
          </div>
        );
      } else {
        return (
          <>오늘의 모국어 피드에 참여하면 {user?.targetLanguage} 피드를 확인할 수 있습니다. 피드에 참여해 보세요!</>
        );
      }
    }
    return <>아직 피드에 참여하지 않았습니다. 피드에 참여해 보세요!</>;
  };

  return (
    <div className="feed-view-container" css={feedViewContainerStyle}>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <LanguagePicker value={feedLang} onChange={handleLangChange} />
        </div>
        {feedLang === user?.nativeLanguage ? renderNativeFeedParticipation() : renderTargetFeedParticipation()}
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          <p>{feedData.result?.feed.sentenceInfo.sentence}</p>
        </div>

        <Recorder />
        <FeedList feedId={feedData.result?.feed.feedId} />
      </div>
    </div>
  );
};

export default FeedView;
