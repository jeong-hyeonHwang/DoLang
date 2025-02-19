import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import styled from '@emotion/styled';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker';
import { useFeedWithMyReaction } from '@/features/Feed/hooks/useFeed';
import { MyFeed } from '@/features/Feed/types/MyFeedResponse.type';
import { css } from '@emotion/react';

const Container = styled.div`
  margin: 0 auto;
  padding: 32px;
  width: 100%;
  min-width: 30rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-bottom: 32px;
`;

const MyFeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DateLabel = styled.div`
  width: 100%;
  max-width: 8rem;
  line-height: 1.6rem;
  background-color: #757575;
  color: #fff;
  border-radius: 2rem 2rem 0 2rem;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  height: 1.6rem;
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex: 1 1;
  padding: 1rem;
  gap: 1rem;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const NativeText = styled.p`
  font-size: 0.8rem;
  min-height: 0.8rem;
  color: #495057;
  margin-bottom: 8px;
`;

const TargetText = styled.b`
  font-size: 1rem;
  min-height: 1rem;
  color: #212529;
`;

const LikeButton = styled.div<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  right: 0;
  top: 0;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
  svg {
    fill: ${(props) => (props.isLiked ? '#e03131' : 'none')};
  }
`;

const BookmarkButton = styled.div<{ isBookmarked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  right: 0;
  top: 0;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
  svg {
    fill: ${(props) => (props.isBookmarked ? '#00c659' : 'none')};
  }
`;

const WaveformContainer = styled.div`
  align-self: flex-end;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 8px;
`;

const feedSentenceSectionStyle = css`
  background-color: #d1d1d1;
  padding: 1rem;
  display: flex;
  flex: 1 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  gap: 1rem;
`;

export default function MyBookmark() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('ko');
  const [isUnfold, setIsUnfold] = useState<boolean>(false);
  const { data: bookmarkList, isLoading, error } = useFeedWithMyReaction({ lang: currentLanguage as 'ko' | 'en' });
  useEffect(() => {
    console.log(bookmarkList);
  }, [bookmarkList]);

  if (isLoading)
    return (
      <div>
        <ClipLoader color="#000" size={40} />
        <p>피드를 불러오는 중입니다...</p>
      </div>
    );
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (bookmarkList?.result.content.length === 0) return <div>북마크한 피드가 없습니다. 피드를 북마크해보세요!</div>;

  return (
    <Container>
      <Header>
        <LanguagePicker value={currentLanguage} onChange={setCurrentLanguage} />
      </Header>

      <MyFeedList>
        {bookmarkList?.result?.content?.map((item) => (
          <CardWrapper key={item.feedId}>
            <DateLabel>{new Date(item.date).toLocaleDateString()}</DateLabel>
            <MyFeedSentence item={item} />
          </CardWrapper>
        ))}
      </MyFeedList>
    </Container>
  );
}

export const MyFeedSentence = ({ item }: { item: MyFeed }) => {
  return (
    <div className="feed-sentence-section" css={feedSentenceSectionStyle}>
      <TargetText>{item.targetSentence}</TargetText>
      <NativeText>{item.nativeSentence}</NativeText>
    </div>
  );
};
