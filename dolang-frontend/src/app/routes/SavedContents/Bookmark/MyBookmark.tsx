import { useState } from 'react';
import styled from '@emotion/styled';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker';
import { useMyFeedWithReaction } from '@/features/Feed/hooks/useFeed';
import { useRecoilState } from 'recoil';
import { userState } from '@/features/Auth/userState';
import { ClipLoader } from 'react-spinners';
import { FeedSentence } from '@/app/routes/FeedView';
import FeedList from '@/app/routes/FeedView';

const Container = styled.div`
  margin: 0 auto;
  padding: 32px;
  width: 70%;
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
  width: 6.5rem;
  max-width: 6.5rem;
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
  display: flex;
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
  font-size: 0.5rem;
  min-height: 0.5rem;
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

export default function MyBookmark() {
  const [currentLanguage, setCurrentLanguage] = useState<string | undefined>(undefined);
  const [user, setUser] = useRecoilState(userState);
  const [isUnfold, setIsUnfold] = useState<boolean>(false);
  const [feedId, setFeedId] = useState<number | undefined>(undefined);
  const { data: bookmarkList, isLoading, error } = useMyFeedWithReaction({ lang: currentLanguage as 'ko' | 'en' });

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
        <FeedSentence item={bookmarkList?.result.content[0]} />
        {bookmarkList?.result.content.map((item) => (
          <div
            className="feed-container"
            key={item.feedId}
            style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
          >
            <DateLabel>{new Date(item.date).toLocaleDateString()}</DateLabel>
            {isUnfold && <FeedList item={item} />}
          </div>
        ))}
      </MyFeedList>
    </Container>
  );
}
