import styled from '@emotion/styled';
import { useState } from 'react';
import { Phone } from 'lucide-react';
import FeedSection from './FeedSection';
import UserProfileImage from './UserProfileImage';
import { theme } from './MainTheme';
import { motion } from 'framer-motion';
import Modal from 'antd/es/modal/Modal';
import { useStompClientContext } from '@/features/Matching/hooks/useClientContext';
import { usePeerContext } from '@/features/VoiceCall/hooks/usePeerContext';
import { MatchingComponent } from '@/features/Matching/components/MatchingComponent';
import { useNavigate } from 'react-router';

const Container = styled.div`
  max-width: 1200px;
  min-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  font-size: ${theme.fontSizes.xxlarge};
  font-weight: bold;
  margin-bottom: 2rem;
  color: ${theme.colors.primary};
`;

const CallSection = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TopicRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TopicContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Flag = styled.img`
  width: 2rem;
  height: 1.5rem;
  object-fit: contain;
`;

const Topics = styled.span`
  color: ${theme.colors.lightText};
  font-size: ${theme.fontSizes.medium};
`;

const CallButton = styled(motion.button)`
  background: ${theme.colors.secondary};
  border: none;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${theme.colors.primary};
  }
`;

const UserProfiles = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const UserProfile = styled(motion.div)`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid ${theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export default function MainViewComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, isMatching, matchedUser, connectionError, connect, disconnect, startMatching, cancelMatching } =
    useStompClientContext();

  const {
    peerId,
    remotePeerId,
    callStatus,
    mediaConnectionRef,
    mediaStreamRef,
    peering,
    initiateCall,
    closeCall,
    setPeer,
    setRemotePeer,
  } = usePeerContext();
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (matchedUser) {
      navigate('/call');
      initiateCall(remotePeerId);
    }
  };

  const handleCancel = () => {
    disconnect();
    cancelMatching();
    setIsModalOpen(false);
  };
  const users = [
    { id: '1', name: 'User 1', profileImage: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'User 2', profileImage: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'User 3', profileImage: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'User 4', profileImage: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'User 5', profileImage: 'https://i.pravatar.cc/150?img=5' },
  ];

  return (
    <Container>
      <Header>음성 통화</Header>

      <CallSection initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <TopicRow>
          <TopicContent>
            <Flag src="https://flagcdn.com/w40/us.png" alt="US Flag" />
            <Topics>#Sports #Movie #Music</Topics>
          </TopicContent>
          <CallButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={openModal}>
            <Phone size={24} />
          </CallButton>
        </TopicRow>
        <Modal title="대화 상대 매칭" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <MatchingComponent />
        </Modal>

        <UserProfiles>
          {users.map((user) => (
            <UserProfile key={user.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <UserProfileImage src={user.profileImage} alt={`${user.name}'s profile`} />
            </UserProfile>
          ))}
        </UserProfiles>
      </CallSection>

      <FeedSection />
    </Container>
  );
}
