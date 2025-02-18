import styled from '@emotion/styled';
import VoiceRecorder from './VoiceRecord';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 32px;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #212529;
`;

function VoiceRecordView() {
  return (
    <>
      {/* <div>VoiceRecordView</div> */}
      <Header>
        <Title>음성기록</Title>
      </Header>
      <VoiceRecorder />
    </>
  );
}
export default VoiceRecordView;
