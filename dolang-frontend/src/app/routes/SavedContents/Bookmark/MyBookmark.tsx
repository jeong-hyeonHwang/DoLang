import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker';
import { useFeedWithMyReaction } from '@/features/Feed/hooks/useFeed';
import { MyFeed } from '@/features/Feed/types/MyFeedResponse.type';
import { getFeedWithMyReactionByFeedId } from '@/features/Feed/services/myFeedService';
import { css } from '@emotion/react';
import { FeedCard } from '../MyFeed/AudioFeed';
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
  background-color: #f8f9fa;
  border-radius: 0.6rem;
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

const FeedDetails = styled.div`
  margin-top: 32px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const FeedItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

export default function MyBookmark() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('ko');
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);
  const { data: bookmarkList, isLoading, error } = useFeedWithMyReaction({ lang: currentLanguage as 'ko' | 'en' });

  const {
    data: feedParticipants,
    isLoading: participantsLoading,
    error: participantsError,
  } = useQuery({
    queryKey: ['feedParticipants', selectedFeedId],
    queryFn: () => getFeedWithMyReactionByFeedId(selectedFeedId!),
    enabled: !!selectedFeedId,
  });

  if (isLoading) return <ClipLoader color="#000" size={40} />;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <Container>
      <Header>
        <LanguagePicker value={currentLanguage} onChange={setCurrentLanguage} />
      </Header>

      {bookmarkList?.result.content.length === 0 ? (
        <div>북마크한 피드가 없습니다. 피드를 북마크해보세요!</div>
      ) : (
        <MyFeedList>
          {bookmarkList?.result?.content?.map((item) => (
            <div
              key={item.feedId}
              css={css`
                display: flex;
                flex-direction: row;
                gap: 1rem;
              `}
            >
              <DateLabel>{new Date(item.date).toLocaleDateString()}</DateLabel>
              <FeedCard item={item} isNativeLanguage={item.isNativeFeed} />
            </div>
          ))}
        </MyFeedList>
      )}
    </Container>
  );
}

export const MyFeedSentence = ({ item }: { item: MyFeed }) => {
  return (
    <div className="feed-sentence-section">
      <TargetText>{item.targetSentence}</TargetText>
      <NativeText>{item.nativeSentence}</NativeText>
    </div>
  );
};
