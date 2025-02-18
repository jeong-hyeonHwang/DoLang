import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useState } from 'react';
import { css } from '@emotion/react';
import Recorder from '../../features/Feed/components/Recorder.tsx';
import { useFeedSentence, useFeedParticipaticipants } from '../../features/Feed/hooks/useFeed.ts';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker.tsx';
import { ClipLoader } from 'react-spinners';
import { FeedCard } from '@/app/routes/SavedContents/MyFeed/AudioFeed.tsx';
import { MyFeed } from '@/features/Feed/types/MyFeedResponse.type.ts';
import { Feed } from '@/features/Feed/types/FeedSentenceResponse.type.ts';
import { FeedItem } from '@/features/Feed/components/FeedItem.tsx';

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
  const { data: feedData, error: feedError } = useFeedSentence(feedLang as 'ko' | 'en');
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

  return (
    <div className="feed-view-container" css={feedViewContainerStyle}>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <LanguagePicker value={feedLang} onChange={handleLangChange} />
        </div>
        <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
          <p>{feedData.result?.feed.sentenceInfo.sentence}</p>
        </div>

        <Recorder feedId={feedData.result?.feed.feedId} />
        {/* {feedData?.result?.feed.userParticipation.postId && (
          <FeedItem
            feedId={feedData.result?.feed.feedId}
            feedProps={{
              ...feedData.result?.feed,
              profileImageUrl: user.profileImageUrl,
              country: user.country,
              voiceUrl: user.voiceUrl,
              voiceCreatedAt: user.voiceCreatedAt,
            }}
            isNativeLanguage={!feedData.result?.feed.isNativeFeed}
          />
        )} */}
        <FeedList feedId={feedData.result?.feed.feedId} isNativeLanguage={feedData.result?.feed.isNativeFeed} />
      </div>
    </div>
  );
};

export default FeedView;
