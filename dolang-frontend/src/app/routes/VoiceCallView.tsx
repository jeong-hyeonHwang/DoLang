import { StompClientProvider } from '../../features/Matching/hooks/useClientContext.tsx';
import MatchingComponent from '../../features/Matching/components/MatchingComponent.tsx';
import { Modal, Button } from 'antd';
import { useState } from 'react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { useNavigate } from 'react-router';
interface MatchResultResponse {
  id: number;
  message: string;
}

const VoiceCallView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, isMatching, matchedUser, connectionError, connect, disconnect, startMatching, cancelMatching } =
    useStompClientContext();
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (matchedUser) {
      console.log('matchedUser', matchedUser);
      navigate('/incall');
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    disconnect();
    cancelMatching();
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button onClick={openModal}>대화 상대 매칭</Button>
      <Modal title="대화 상대 매칭" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <MatchingComponent />
      </Modal>
    </div>
  );
};

export default VoiceCallView;
