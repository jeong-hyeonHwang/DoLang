import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';
import { callLogGet } from '@/api/utils/callLog';
import Cookies from 'js-cookie';
import convertToCountryTime from '@/api/utils/convertToCountryTime';
import convertToUserInfo from '@/api/utils/convertToUserInfo';
import 'flag-icons/css/flag-icons.min.css';
import { Plus, Edit, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* height: calc(100vh - 60px); */
  background-color: #f8f9fa;
  padding-top: 20px;
  margin-bottom: 24px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* min-width: 700px; */
`;

const MainContent = styled.div`
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

const TextArea = styled.div`
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

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  }
`;

const Text = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  /* margin-top: 20px; */
  align-items: center;
`;
const PaginationButton = styled.button`
  background-color: #f8f9fa;
  justify-content: center;
  width: 50px;
  height: 40px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`;

interface User {
  id: string;
  name: string;
  color: string;
}

export default function CallLog() {
  const [activeUser, setActiveUser] = useState<string>('1');
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const accessToken = Cookies.get('access_token');

  const navigate = useNavigate();

  const handleNavigate = (callInfo: any) => {
    navigate(`/savedContents/calls/detail?matchedUser=${callInfo.matchedUser.userId}&callTime=${callInfo.startedAt}`, {
      state: { callInfo },
    });
  };

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const res = await callLogGet(accessToken, page, 5);
        setTotalPages(res.totalPages);

        // countryId로 시간 변환
        const formattedLogs = res.content.map((log: any) => ({
          ...log,
          formattedMatchedUserInfo: convertToUserInfo(
            log.matchedUser.countryId,
            log.matchedUser.interestLanguageId,
            log.matchedUser.nativeLanguageId
          ),
          formattedTime: convertToCountryTime(log.startedAt, log.endedAt, log.me.countryId),
        }));

        setCallLogs(formattedLogs);
      } catch (error) {
        setError('Error fetching call log data');
        console.error('Error fetching call log data: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallLogs();
  }, [accessToken, page]);

  const goToPreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };
  const goToNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <Container>
      <MainContent>
        {!(totalPages === 0) && (
          <PaginationContainer style={{ marginTop: '-30px', marginBottom: '20px' }}>
            <PaginationButton onClick={goToPreviousPage} disabled={page === 0} style={{ marginRight: '20px' }}>
              <ChevronLeft style={{ marginLeft: '-5px' }} />
            </PaginationButton>
            <span>{`Page ${page + 1} of ${totalPages}`}</span>
            <PaginationButton onClick={goToNextPage} disabled={page === totalPages - 1} style={{ marginLeft: '20px' }}>
              <ChevronRight style={{ marginLeft: '-5px' }} />
            </PaginationButton>
          </PaginationContainer>
        )}

        {(() => {
          if (callLogs && callLogs.length > 0) {
            return callLogs.map((log, index) => (
              <TextArea key={index} onClick={() => handleNavigate(log)} style={{ cursor: 'pointer' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <DateContent>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>통화시간</span>
                    <span>
                      <DateText>{log.formattedTime.startedAt}</DateText>
                      <DateText> ~ </DateText>
                      <DateText>{log.formattedTime.endedAt}</DateText>
                      <DateText> | </DateText>
                      <DateText style={{ fontWeight: 'bold' }}>{log.formattedTime.label} </DateText>
                    </span>
                  </DateContent>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <ContentContainer style={{ display: 'flex', justifyContent: 'center', flex: '0.7' }}>
                    <ProfileImage
                      src={
                        log.matchedUser.profileImageUrl instanceof File
                          ? URL.createObjectURL(log.matchedUser.profileImageUrl)
                          : log.matchedUser.profileImageUrl || 'default-user.png'
                      }
                      alt="Profile"
                    />
                  </ContentContainer>
                  <ContentContainer>
                    <Text style={{ textAlign: 'right', fontWeight: 'bold', flex: '1.3', paddingRight: '10px' }}>
                      <span>Nickname |</span>
                      <span>Nationality |</span>
                      <span>NativeLanguage |</span>
                      <span>InterestLanguage |</span>
                    </Text>
                    <Text style={{ textAlign: 'left' }}>
                      <span>{log.matchedUser.nickname || 'Unknown'}</span>
                      <span>
                        <span
                          className={`fi fi-${log.formattedMatchedUserInfo.nationality_flag}`}
                          style={{
                            border: '0.1px solid #75757560',
                            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                            marginRight: '8px',
                          }}
                        />
                        {log.formattedMatchedUserInfo.nationality || 'Unknown'}
                      </span>
                      <span>{log.formattedMatchedUserInfo.nativeLanguage || 'Unknown'}</span>
                      <span>{log.formattedMatchedUserInfo.interestLanguage || 'Unknown'}</span>
                    </Text>
                  </ContentContainer>
                </div>
              </TextArea>
            ));
          } else {
            return <div>아직 통화 기록이 없습니다.</div>;
          }
        })()}
      </MainContent>
    </Container>
  );
}
