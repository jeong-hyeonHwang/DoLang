import FeedList from '../../features/Feed/components/FeedList.tsx';
import { useState } from 'react';
import { css } from '@emotion/react';
import Recorder from '../../features/Feed/components/Recorder.tsx';
import { useFeedSentence } from '../../features/Feed/hooks/useFeed.ts';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker.tsx';
import { ClipLoader } from 'react-spinners';
import { Feed } from '../../features/Feed/types/FeedSentenceResponse.type.ts';

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

  const feedviewcontainerstyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  `;

  const [feedlang, setfeedlang] = useState<string>('en');
  const { data: feeddata, error: feederror } = useFeedSentence(feedlang as 'ko' | 'en');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const handlelangchange = (value: string) => setfeedlang(value);

  // 에러가 있을 경우 에러 메시지만 렌더링
  if (feederror) {
    return (
      <div className="feed-view-container" css={feedviewcontainerstyle}>
        <p>피드 데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // data가 아직 없을 경우 로딩중 메시지만 렌더링
  if (!feeddata) {
    return (
      <div className="feed-view-container" css={feedviewcontainerstyle}>
        <ClipLoader color="#000" size={40} />
        <p>피드를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="feed-view-container" css={feedviewcontainerstyle}>
      <div className="feed-container" css={feedContainerStyle}>
        <div className="feed-header" css={feedHeaderStyle}>
          <h2>오늘의 피드</h2>
          <LanguagePicker value={feedlang} onChange={handlelangchange} />
        </div>

        <FeedSentence item={feeddata.result?.feed} />
        <Recorder feedId={feeddata.result?.feed.feedId} />
        <FeedList feedId={feeddata.result?.feed.feedId} isNativeLanguage={feeddata.result?.feed.isNativeFeed} />
      </div>
    </div>
  );
};

export const FeedSentence = ({ item }: { item: Feed }) => {
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
  return (
    <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
      <p>{item.sentenceInfo.sentence}</p>
    </div>
  );
};
export default FeedView;

