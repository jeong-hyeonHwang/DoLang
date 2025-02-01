import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const LoginSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 30px;
  margin: 10px 0 40px 0;
`;

const LoginText = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: lightcoral;
`;

function MiniProfile() {
  return (
    <div>
      <LoginSection>
        <Avatar />
        <LoginText>닉네임</LoginText>
      </LoginSection>
    </div>
  );
}

export default MiniProfile;
