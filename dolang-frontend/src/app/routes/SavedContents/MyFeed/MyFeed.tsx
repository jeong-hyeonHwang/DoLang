import { useState } from 'react';
import styled from '@emotion/styled';
import { Heart } from 'lucide-react';
import AudioPlayer from './MyAudioPlayer';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker';

interface FeedItem {
  id: string;
  date: string;
  koreanText: string;
  englishText: string;
  audioUrl: string;
  likes: number;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
`;

const Control = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
  margin-top: -10px;
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FeedContent = styled.div`
  display: flex;
  gap: 35px;
  align-items: flex-start;
`;

const DateBubble = styled.div`
  position: relative;
  min-width: 120px;
`;

const DateText = styled.text`
  font-family: "'Noto Sans KR', sans-serif";
  font-size: 26px;
  font-weight: bold;
  fill: white;
  text-anchor: middle;
`;

const CardContainer = styled.div`
  background-color: #757575a4;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 5px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 8px;
`;

const KoreanText = styled.p`
  font-size: 14px;
  color: #495057;
  margin-bottom: 5px;
  text-align: left;
`;

const EnglishText = styled.p`
  font-size: 16px;
  color: #212529;
  font-weight: 500;
  text-align: left;
`;

const ActionControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const FeedCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const LikeButton = styled.button<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.isLiked ? '#e03131' : '#495057')};
  padding: 8px;
  border-radius: 20px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f3f5;
  }

  svg {
    fill: ${(props) => (props.isLiked ? '#e03131' : 'none')};
  }
`;

const sampleFeedItems: FeedItem[] = [
  {
    id: '1',
    date: '2024-01-16',
    koreanText: '늘 행복하고 지혜로운 사람이 되려면 자주 변해야 한다.',
    englishText: 'They must often change who would be constant in happiness or wisdom.',
    audioUrl: '/audio1.mp3',
    likes: 23,
  },
  {
    id: '2',
    date: '2024-01-15',
    koreanText: '인생에서 가장 큰 영광은 넘어지지 않는 것이 아니라 매번 일어서는 것이다.',
    englishText: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    audioUrl: '/audio2.mp3',
    likes: 18,
  },
  {
    id: '3',
    date: '2024-01-14',
    koreanText: '인생에서 가장 큰 영광은 넘어지지 않는 것이 아니라 매번 일어서는 것이다.',
    englishText: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    audioUrl: '/audio2.mp3',
    likes: 18,
  },
];

export default function MyAudioFeed() {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [playingId, setPlayingId] = useState<string | null>(null);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  const handlePlay = (id: string) => {
    setPlayingId(id);
  };

  const handlePause = () => {
    setPlayingId(null);
  };

  return (
    <Container>
      <Control>
        <LanguagePicker />
      </Control>

      <Feed>
        {sampleFeedItems.map((item) => (
          <FeedContent key={item.id}>
            <DateBubble>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="60"
                viewBox="0 0 200 100"
                style={{ filter: 'drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.3))' }}
              >
                <path
                  d="M20 10 H180 A10 10 0 0 1 190 20 V70 A10 10 0 0 1 180 80 H20 A10 10 0 0 1 10 70 V20 A10 10 0 0 1 20 10 Z"
                  fill="#757575"
                />
                <polygon points="170,80 180,50 200,80" fill="#757575" />
                <DateText x="100" y="53">
                  {new Date(item.date)
                    .toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                    .replace(/\./g, '')
                    .split(' ')
                    .join('.')}
                </DateText>
              </svg>
            </DateBubble>

            <CardContainer>
              <CardContent>
                <TextContent>
                  <KoreanText>{item.koreanText}</KoreanText>
                  <EnglishText>{item.englishText}</EnglishText>
                </TextContent>
                <ActionControls>
                  <AudioPlayer
                    url={item.audioUrl}
                    onPlay={() => handlePlay(item.id)}
                    onPause={handlePause}
                    playing={playingId === item.id}
                  />
                  <LikeButton isLiked={likedItems.has(item.id)} onClick={() => toggleLike(item.id)}>
                    <Heart size={20} />
                    {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                  </LikeButton>
                </ActionControls>
              </CardContent>
            </CardContainer>
          </FeedContent>
        ))}
      </Feed>
    </Container>
  );
}
