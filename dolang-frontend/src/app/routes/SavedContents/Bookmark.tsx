import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { CalendarIcon, Play, User, ChevronDown } from 'lucide-react';
import LanguagePicker from '../../../shared/components/Picker/LanguagePicker';

const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
const targetLang = userData?.targetLanguage;

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

const BookmarkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BookmarkItem = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const DateLabel = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 20px;
  font-size: 14px;
  margin: 16px;
`;

const BookmarkContent = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContent = styled.div`
  flex: 1;
`;

const BookmarkText = styled.p`
  font-size: 16px;
  color: #212529;
`;

const Controls2 = styled.div`
  display: flex;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #495057;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f3f5;
  }
`;

interface BookmarkData {
  id: string;
  date: string;
  text: string;
}

const sampleBookmarks: BookmarkData[] = [
  {
    id: '1',
    date: '2024-01-16',
    text: '성공은 열정을 잃지 않고 실패를 거듭할 수 있는 능력이다.',
  },
  {
    id: '2',
    date: '2024-01-15',
    text: '당신의 미래는 당신이 지금 무엇을 하고 있는지에 달려있다.',
  },
  {
    id: '3',
    date: '2024-01-14',
    text: '모든 성취의 시작점은 갈망이다.',
  },
];

export default function Bookmarks() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <Container>
      <Header>
        <Title>북마크</Title>
        <Controls>{/* <LanguagePicker render={({ field }) => <LanguagePicker {...field}/>} */}</Controls>
      </Header>

      <BookmarkList>
        {sampleBookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id}>
            <DateLabel>{bookmark.date}</DateLabel>
            <BookmarkContent>
              <Avatar>
                <User size={20} />
              </Avatar>
              <TextContent>
                <BookmarkText>{bookmark.text}</BookmarkText>
              </TextContent>
              <Controls2>
                <IconButton>
                  <Play size={20} />
                </IconButton>
              </Controls2>
            </BookmarkContent>
          </BookmarkItem>
        ))}
      </BookmarkList>
    </Container>
  );
}
