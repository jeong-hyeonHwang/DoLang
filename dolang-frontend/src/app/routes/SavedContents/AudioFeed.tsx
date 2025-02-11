import { useState } from 'react';
import styled from '@emotion/styled';
import { Heart, Calendar, ChevronDown } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #212529;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Flag = styled.img`
  width: 24px;
  height: 16px;
  object-fit: contain;
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const CardContent = styled.div`
  padding: 24px;
`;

const DateLabel = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const Text = styled.div`
  margin-bottom: 20px;
`;

const KoreanText = styled.p`
  font-size: 16px;
  color: #495057;
  margin-bottom: 8px;
`;

const EnglishText = styled.p`
  font-size: 18px;
  color: #212529;
  font-weight: 500;
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
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
    date: '2024-01-14',
    koreanText: '인생에서 가장 큰 영광은 넘어지지 않는 것이 아니라 매번 일어서는 것이다.',
    englishText: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    audioUrl: '/audio2.mp3',
    likes: 18,
  },
];

export default function AudioFeed() {
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
      <Header>
        <Title>내 피드</Title>
        <Controls>
          <Button>
            <Calendar size={18} />
            날짜 선택
          </Button>
          <Button>
            <Flag src="https://flagcdn.com/w40/us.png" alt="US Flag" />
            English
            <ChevronDown size={18} />
          </Button>
        </Controls>
      </Header>

      <Feed>
        {sampleFeedItems.map((item) => (
          <FeedCard key={item.id}>
            <CardContent>
              <DateLabel>{item.date}</DateLabel>
              <Text>
                <KoreanText>{item.koreanText}</KoreanText>
                <EnglishText>{item.englishText}</EnglishText>
              </Text>
              <AudioControls>
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
              </AudioControls>
            </CardContent>
          </FeedCard>
        ))}
      </Feed>
    </Container>
  );
}
