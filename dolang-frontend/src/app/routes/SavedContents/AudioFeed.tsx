import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker';
import { useMyFeed } from '@/features/Feed/hooks/useFeed';
import { Bookmark, Heart } from 'lucide-react';
import Waveform from '@/shared/components/waveform/Waveform';
import { useRecoilState } from 'recoil';
import { userState } from '@/features/Auth/userState';
import { postBookmark, postHeart } from '@/features/Feed/services/reactionService';
import { MyFeed } from '@/features/Feed/types/MyFeedResponse.type';
import { css } from '@emotion/react';

const Container = styled.div`
  margin: 0 auto;
  padding: 32px;
  width: 42rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #212529;
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

const WaveformContainer = styled.div`
  align-self: flex-end;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 8px;
`;

export default function AudioFeed() {
  const [currentLanguage, setCurrentLanguage] = useState<string | undefined>(undefined);
  const [isNativeLanguage, setIsNativeLanguage] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user?.nativeLanguage === currentLanguage) setIsNativeLanguage(true);
  }, [user?.nativeLanguage, currentLanguage]);

  const { data: myFeedList, isLoading } = useMyFeed({ lang: currentLanguage as 'ko' | 'en' });

  return (
    <Container>
      <Header>
        <Title>내 피드</Title>
        <LanguagePicker value={currentLanguage} onChange={setCurrentLanguage} />
      </Header>

      {isLoading ? (
        <div>피드를 불러오는 중입니다...</div>
      ) : (
        <MyFeedList>
          {myFeedList?.result.content.map((item) => (
            <div
              className="feed-container"
              key={item.feedId}
              style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
            >
              <DateLabel>{new Date(item.date).toLocaleDateString()}</DateLabel>
              <FeedCard item={item} isNativeLanguage={isNativeLanguage} />
            </div>
          ))}
        </MyFeedList>
      )}
    </Container>
  );
}

export const FeedCard = ({ item, isNativeLanguage }: { item: MyFeed; isNativeLanguage: boolean }) => {
  const handleBookmark = (feedId: number, postId: number) => postBookmark(feedId, postId);
  const handleHeart = (feedId: number, postId: number) => postHeart(feedId, postId);

  return (
    <div css={feedCardStyle}>
      <CardWrapper>
        <Text>
          <NativeText>{item.nativeSentence}</NativeText>
          <TargetText>{item.targetSentence}</TargetText>
        </Text>

        {isNativeLanguage ? (
          <LikeButton isLiked={!!item.isSelfHearted} onClick={() => handleHeart(item.feedId, item.postId)}>
            <Heart size={20} />
            {item.heartCount}
          </LikeButton>
        ) : (
          <LikeButton isLiked={!!item.isSelfBookmarked} onClick={() => handleBookmark(item.feedId, item.postId)}>
            <Bookmark size={20} />
            {item.bookmarkCount}
          </LikeButton>
        )}

        <WaveformContainer>
          <Waveform audioSrc={item.voiceUrl} />
        </WaveformContainer>
      </CardWrapper>
    </div>
  );
};

const feedCardStyle = css`
  display: flex;
  flex: 1 1;
  min-width: 300px;
  position: relative;
  justify-content: space-between;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
  }
`;