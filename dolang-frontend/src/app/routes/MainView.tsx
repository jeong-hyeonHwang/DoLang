import FloatingRecord from '../../shared/components/FloatingButton/FloatingRecord';
import MainViewComponent from './MainView/MainViewComponent';
export default function MainView() {
import { MatchingComponent } from '../../features/Matching/components/MatchingComponent.tsx';
import { Modal, Button } from 'antd';
import { useState } from 'react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { useNavigate } from 'react-router';
import { usePeerContext } from '../../features/VoiceCall/hooks/usePeerContext.tsx';

const MainView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, isMatching, matchedUser, connectionError, connect, disconnect, startMatching, cancelMatching } =
    useStompClientContext();

  const {
    peerId,
    remotePeerId,
    callStatus,
    audioRef,
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
      console.log('matchedUser', matchedUser);
      navigate('/call');
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    disconnect();
    cancelMatching();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* <div>MainView</div>; */}
      <FloatingRecord />
      <MainViewComponent />
    </>
    <div>
      <Button onClick={openModal}>대화 상대 매칭</Button>
      <Modal title="대화 상대 매칭" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <MatchingComponent />
      </Modal>
    </div>
  );
}

export default MainView;
