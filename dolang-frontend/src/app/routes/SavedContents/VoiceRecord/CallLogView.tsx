import styled from '@emotion/styled';
import CallLog from './CallLog';

const PageContainer = styled.div`
  background-color: #fff;
  max-width: 840px;
  margin: 0 4rem;
  display: flex;
  flex-direction: column;
  width: 80%;
  /* min-width: 300px; */
  /* padding: 0 2rem; */
`;

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

function CallLogView() {
  return (
    <>
      <PageContainer>
        <Header>
          <Title>통화 기록</Title>
        </Header>
        <CallLog />
      </PageContainer>
    </>
  );
}
export default CallLogView;
