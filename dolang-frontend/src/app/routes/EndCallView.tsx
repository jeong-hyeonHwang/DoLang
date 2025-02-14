import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { UserImageWrapper } from '@/shared/components/nameCard/NameCard.tsx';
import { css } from '@emotion/react';
import { Link } from 'react-router';
import { CallTimer } from '../../features/VoiceCall/components/CallTimer.tsx';
import { useEffect } from 'react';
import { useCallContext } from '@/features/VoiceCall/hooks/useCallContext';

function EndCallView() {
  const { matchedUser } = useStompClientContext();
  const { endCall, hour, minute, second } = useCallContext();
  const viewStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background-color: #111;
  `;

  const messageContainerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 30em;
    width: 70vw;
    padding: 2rem;
    align-items: center;
    justify-content: space-between;
    border-radius: 1rem;
    background-color: #575a5e;
  `;

  // 분, 초를 두 자리 숫자로 포매팅
  const formattedMinute = minute.toString().padStart(2, '0');
  const formattedSecond = second.toString().padStart(2, '0');

  useEffect(() => {
    endCall();
  }, []);

  return (
    <div className="voice-call-view" css={viewStyle}>
      <section className="end-call-container" css={messageContainerStyle}>
        <CallTimer />

        <div
          className="end-call-profile-wrapper"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <UserImageWrapper
            profileImageUrl={matchedUser?.profileImageUrl || ''}
            userNickname={matchedUser?.nickname || ''}
            userCountry={matchedUser?.countryId || ''}
          />
        </div>
        <div
          className="end-call-message-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2>대화가 종료되었습니다.</h2>
          <b>대화 내용을 마이페이지에서 다시 볼 수 있어요.</b>
          <p>
            총 통화 시간: {hour > 0 ? `${hour}:` : ''}
            {formattedMinute}:{formattedSecond}
          </p>
        </div>

        <Link to="/">
          <button className="end-call-button">메인으로</button>
        </Link>
      </section>
    </div>
  );
}

export default EndCallView;
