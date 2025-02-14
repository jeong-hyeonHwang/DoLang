import { useState } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const Container = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background-color: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 24px;
  overflow-y: auto;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UserItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${(props) => (props.isActive ? '#e8f5e9' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#e8f5e9' : '#f1f3f5')};
  }
`;

const Avatar = styled.div<{ bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || '#e9ecef'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const UserName = styled.span`
  font-size: 16px;
  color: #495057;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Counter = styled.div`
  font-size: 16px;
  color: #868e96;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TextArea = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Text = styled.div`
  margin-bottom: 24px;
`;

const TextLabel = styled.div`
  font-size: 14px;
  color: #868e96;
  margin-bottom: 8px;
`;

const TextContent = styled.div`
  font-size: 18px;
  color: #212529;
  line-height: 1.6;
`;

interface User {
  id: string;
  name: string;
  color: string;
}

const sampleUsers: User[] = [
  { id: '1', name: 'Ellen', color: '#4caf50' },
  { id: '2', name: 'John', color: '#2196f3' },
  { id: '3', name: 'Sarah', color: '#ff9800' },
];

export default function VoiceRecorder() {
  const [activeUser, setActiveUser] = useState<string>('1');

  return (
    <Container>
      <Sidebar>
        <UserList>
          {sampleUsers.map((user) => (
            <UserItem key={user.id} isActive={user.id === activeUser} onClick={() => setActiveUser(user.id)}>
              <Avatar bgColor={user.color}>{user.name[0]}</Avatar>
              <UserName>{user.name}</UserName>
            </UserItem>
          ))}
          <UserItem>
            <Avatar>
              <Plus size={20} />
            </Avatar>
            <UserName>Add User</UserName>
          </UserItem>
        </UserList>
      </Sidebar>

      <MainContent>
        <Header>
          <Controls>
            <Button>
              <Edit size={16} />
              수정
            </Button>
            <Button>
              <MessageSquare size={16} />
              주석
            </Button>
          </Controls>
          <Counter>
            <ChevronLeft size={20} />
            <span>10/24</span>
            <ChevronRight size={20} />
          </Counter>
        </Header>

        <TextArea>
          <Text>
            <TextLabel>English</TextLabel>
            <TextContent>
              The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at
              least once.
            </TextContent>
          </Text>
          <Text>
            <TextLabel>한국어</TextLabel>
            <TextContent>다람쥐 헌 쳇바퀴에 타고파. 이 문장은 한글 자음과 모음을 모두 포함하고 있습니다.</TextContent>
          </Text>
        </TextArea>
      </MainContent>
    </Container>
  );
}
