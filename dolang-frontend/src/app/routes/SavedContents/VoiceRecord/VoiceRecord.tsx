import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled from '@emotion/styled';
import { translatePost } from '@/api/utils/translate_post';
import { Plus, Edit, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';

const UserContent = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e9ecef;
`;

const DateContent = styled.div`
  background-color: #75757545;
  border-radius: 30px;
  width: 360px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: -10px;
  margin-bottom: 30px;
  padding: 5px;
`;
const DateText = styled.text`
  font-size: 11px;
`;

const ContentContainer = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserTextArea = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-width: 530px;
  min-height: 100px;
`;

const UserText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// ==============================

const Container = styled.div`
  display: flex;
  /* height: calc(100vh - 60px); */
  background-color: #f8f9fa;
  border-radius: 30px;
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

const TextArea = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-height: 520px;
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

export default function VoiceRecorder() {
  const [text, setText] = useState('');
  const [translateText, setTranslateText] = useState('');
  const accessToken = Cookies.get('access_token');
  const navigate = useNavigate();

  const location = useLocation();
  const callInfo = location.state?.callInfo;

  const handleBack = () => {
    navigate(`/savedContents/calls`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleTranslate = async () => {
    try {
      const response = await translatePost(text, callInfo.me.interestLanguageId, accessToken);

      if (response?.data.code === 200) {
        setTranslateText(response.data.result.translations[0]);
      }
    } catch (error) {
      console.error('API ERROR', error);
    }
  };

  return (
    <>
      <button
        onClick={handleBack}
        style={{
          width: '150px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer',
        }}
      >
        <ChevronLeft />
        <span>뒤로가기</span>
      </button>
      <UserContent>
        {
          <UserTextArea>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <DateContent>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>통화시간</span>
                <span>
                  <DateText>{callInfo.formattedTime.startedAt}</DateText>
                  <DateText> ~ </DateText>
                  <DateText>{callInfo.formattedTime.endedAt}</DateText>
                  <DateText> | </DateText>
                  <DateText style={{ fontWeight: 'bold' }}>{callInfo.formattedTime.label} </DateText>
                </span>
              </DateContent>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <ContentContainer style={{ display: 'flex', justifyContent: 'center', flex: '0.7' }}>
                <ProfileImage
                  src={
                    callInfo.matchedUser.profileImageUrl instanceof File
                      ? URL.createObjectURL(callInfo.matchedUser.profileImageUrl)
                      : callInfo.matchedUser.profileImageUrl || 'default-user.png'
                  }
                  alt="Profile"
                />
              </ContentContainer>
              <ContentContainer>
                <UserText style={{ textAlign: 'right', fontWeight: 'bold', flex: '1.3', paddingRight: '10px' }}>
                  <span>Nickname |</span>
                  <span>Nationality |</span>
                  <span>NativeLanguage |</span>
                  <span>InterestLanguage |</span>
                </UserText>
                <UserText style={{ textAlign: 'left' }}>
                  <span>{callInfo.matchedUser.nickname || 'Unknown'}</span>
                  <span>
                    <span
                      className={`fi fi-${callInfo.formattedMatchedUserInfo.nationality_flag}`}
                      style={{
                        border: '0.1px solid #75757560',
                        boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                        marginRight: '8px',
                      }}
                    />
                    {callInfo.formattedMatchedUserInfo.nationality || 'Unknown'}
                  </span>
                  <span>{callInfo.formattedMatchedUserInfo.nativeLanguage || 'Unknown'}</span>
                  <span>{callInfo.formattedMatchedUserInfo.interestLanguage || 'Unknown'}</span>
                </UserText>
              </ContentContainer>
            </div>
          </UserTextArea>
        }
      </UserContent>

      <Container>
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
          </Header>

          <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '20px', alignItems: 'center' }}>
            <TextArea>
              <Text>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '20px',
                  }}
                >
                  <TextLabel
                    style={{
                      margin: '0 auto',
                      fontWeight: 'bold',
                      marginRight: '80px',
                      fontSize: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    한국어
                  </TextLabel>
                </div>

                <TextContent>
                  다람쥐 헌 쳇바퀴에 타고파. 이 문장은 한글 자음과 모음을 모두 포함하고 있습니다.
                </TextContent>
              </Text>
              <div>
                <textarea type="text" value={text} onChange={handleChange} placeholder="텍스트 입력" />
              </div>
            </TextArea>
            <button
              onClick={handleTranslate}
              style={{
                marginTop: '-40',
                whiteSpace: 'nowrap',
                width: '60px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#d3d3d3',
                fontWeight: 'bold',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              번역
            </button>
            <TextArea>
              <Text>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '20px',
                  }}
                >
                  <TextLabel
                    style={{
                      margin: '0 auto',
                      fontWeight: 'bold',
                      marginRight: '80px',
                      fontSize: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    English
                  </TextLabel>
                  {/* <button style={{ marginTop: '-40', whiteSpace: 'nowrap' }}>번역</button> */}
                </div>
                <TextContent>
                  The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English
                  alphabet at least once.
                </TextContent>
                <div>
                  번역 결과 <br />
                  {translateText.text}
                </div>
              </Text>
            </TextArea>
          </div>
        </MainContent>
      </Container>
    </>
  );
}
