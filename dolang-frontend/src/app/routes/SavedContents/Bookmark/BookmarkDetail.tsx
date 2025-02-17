import { useState } from 'react';
import styled from '@emotion/styled';
import { Heart } from 'lucide-react';
import AudioPlayer from './MyAudioPlayer';
import LanguagePicker from '@/shared/components/Picker/LanguagePicker';
import { useParams } from 'react-router';

interface BookmarkItem {
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

const Bookmark = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BookmarkContent = styled.div`
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  }
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
  margin: 8px;
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

const sampleBookmarkItems: BookmarkItem[] = [
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

export default function BookmarkDetail() {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { date } = useParams();

  return (
    <Container>
      <Control>
        <LanguagePicker />
      </Control>

      <Bookmark>Selected Date: {date}</Bookmark>
    </Container>
  );
}
