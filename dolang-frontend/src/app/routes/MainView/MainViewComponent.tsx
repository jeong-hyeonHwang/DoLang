import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { theme } from './MainTheme';
import { motion } from 'framer-motion';
import Modal from 'antd/es/modal/Modal';
import { useStompClientContext } from '@/features/Matching/hooks/useClientContext';
import { usePeerContext } from '@/features/VoiceCall/hooks/usePeerContext';
import { MatchingComponent } from '@/features/Matching/components/MatchingComponent';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { userGet } from '@/api/utils/useUser';
import { userState } from '@/features/Auth/userState';
import Cookies from 'js-cookie';
import MainFeedView from './MainFeedView';

const Container = styled.div`
  max-width: 1200px;
  min-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  overflow: hidden;
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
  margin-bottom: 3rem;

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
  height: 10rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TopicRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* margin-bottom: 1rem; */
`;

const TopicContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 3rem; */
  /* align-items: center; */
  width: 100%;
`;

const Flag = styled.img`
  width: 4rem;
  height: 2.5rem;
  margin-top: 10px;
  /* text-decoration: none; */
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  /* object-fit: contain; */
`;

const Topics = styled.span`
  color: ${theme.colors.lightText};
  font-size: ${theme.fontSizes.medium};
  margin-top: -40px;
  flex-grow: 1;
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
  /* margin-left: 30px; */

  &:hover {
    background: ${theme.colors.primary};
  }
`;

export default function MainViewComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { matchedUser, disconnect, cancelMatching } = useStompClientContext();
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn') || 'false');

  const accessToken = Cookies.get('access_token');
  const defaultUser = sessionStorage.getItem('user');

  // 실제 user의 정보를 불러와서 call 옆에 띄우기
  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const storedUser = await userGet(accessToken);
        // console.log(storedUser);
        setUser(storedUser?.result || defaultUser);
      } catch (error) {
        console.error('failed to fetch user', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken]);

  const { remotePeerId, initiateCall } = usePeerContext();
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

  return (
    <Container>
      <Header>음성 통화</Header>

      <CallSection initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <TopicRow>
          <TopicContent>
            {loading ? (
              <p>불러오는 중...</p>
            ) : isLoggedIn && user ? (
              <Flag className={`fi fi-${user?.nationality}`} />
            ) : null}
            <Topics style={{ marginLeft: '10px', marginRight: '10px' }}>
              {loading ? (
                <p>불러오는 중...</p>
              ) : isLoggedIn && user ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontWeight: 'bold' }}>
                    나의 관심사 태그
                    <button onClick={() => navigate('/profile')} style={{ marginLeft: '10px', fontSize: '12px' }}>
                      수정
                    </button>
                  </p>
                  <span style={{ whiteSpace: 'wrap' }}>
                    {user.interests?.length > 0
                      ? user.interests.map((interest) => `#${interest.tagName || interest.name}`).join(' ')
                      : '관심사 설정이 필요합니다.'}
                  </span>
                </div>
              ) : (
                <p>로그인이 필요합니다.</p>
              )}
            </Topics>
          </TopicContent>
          {isLoggedIn && (
            <CallButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={openModal}>
              <Phone size={24} />
            </CallButton>
          )}
        </TopicRow>
        <Modal title="대화 상대 매칭" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <MatchingComponent />
        </Modal>
      </CallSection>

      <MainFeedView />
    </Container>
  );
}
