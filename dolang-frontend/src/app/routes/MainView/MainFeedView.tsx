import { theme } from './MainTheme.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { css } from '@emotion/react';
import { useFeedSentence } from '@/features/Feed/hooks/useFeed.ts';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker.tsx';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { FeedSentence } from '../FeedView.tsx';
import styled from '@emotion/styled';
import BaseFeedList from '@/features/Feed/components/BaseFeedList.tsx';

const FeedContainer = styled(motion.div)`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes.xlarge};
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const MainFeedView = () => {
  const navigate = useNavigate();

  const feedContainerStyle = css`
    min-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  const feedHeaderStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  `;

  const feedViewContainerStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  `;

  const feedDetailButton = css`
    margin-left: auto;
    :hover {
      border: none;
      color: #3a853e;
      text-decoration: underline #3a853e;
    }
    &:focus {
      outline: none;
      border: none;
    }
  `;
  const [feedLang, setFeedLang] = useState<string>('en');
  const { data: feedData, error: feedError } = useFeedSentence(feedLang as 'ko' | 'en');
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
    <FeedContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="feed-view-container" css={feedViewContainerStyle}>
        <div className="feed-container" css={feedContainerStyle}>
          <div className="feed-header" css={feedHeaderStyle}>
            <Title>오늘의 피드</Title>
            <LanguagePicker value={feedLang} onChange={handleLangChange} />
            <button
              onClick={() => {
                navigate('/feed');
              }}
              css={feedDetailButton}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                marginBottom: '-50px',
              }}
            >
              자세히보기 &gt;
            </button>
          </div>

          {feedData?.code === 403 ? (
            <FeedSentence sentence={'모국어 피드에 참여하시면 학습 언어 피드를 확인할 수 있습니다!'} />
          ) : (
            <FeedSentence sentence={feedData?.result?.feed.sentenceInfo.sentence} />
          )}
          <BaseFeedList
            feedId={feedData?.result?.feed.feedId}
            isNativeLanguage={feedData?.result?.feed.isNativeFeed}
            variant="main"
          />
        </div>
      </div>
    </FeedContainer>
  );
};

export default MainFeedView;
