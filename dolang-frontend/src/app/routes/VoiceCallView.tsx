import { useEffect, useState } from 'react';
import { Mic, PhoneOff } from 'lucide-react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { usePeerContext } from '../../features/VoiceCall/hooks/usePeerContext.tsx';
import { User } from '@/shared/types/UserInfo.type.ts';
import { styles } from '../../features/VoiceCall/components/styles.ts';
import { useCallContext } from '../../features/VoiceCall/hooks/useCallContext.tsx';
import VoiceCallChat from '@/features/VoiceCall/components/VoiceCallChat.tsx';

function VoiceCallView() {
  const { matchingResult } = useStompClientContext();
  const { callStatus, audioRef } = usePeerContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user') || 'false');
    setUser(storedUser);
  }, []);

  return (
    <>
      <div css={styles.voiceCallView}>
        {/* 통화 상태 표시 */}
        <div>{callStatus}</div>

        {/* 통화 참여자 & 오디오 */}
        <div css={styles.callParticipantsContainer}>
          {user && <CallParticipant user={user} />}
          <CallTopic audioRef={audioRef} />
          {user && <CallParticipant user={user} />}
        </div>

        {/* 통화 컨트롤 버튼 */}
        <CallControls />
      </div>
      <VoiceCallChat />
    </>
  );
}

const CallParticipant = ({ user }: { user: User }) => (
  <div css={styles.callParticipant}>
    <img src={user.profileImageUrl || ''} css={styles.userImage} />
    <div css={styles.userInfo}>
      <span>{user.nickname}</span>
      <span className={`fi fi-${user.nationality}`} css={styles.countryFlag} />
    </div>
  </div>
);

const CallTopic = ({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) => (
  <div css={styles.callTopicContainer}>
    <CallTagsContainer tags={['tag1', 'tag2', 'tag3']} />
    <CallTopicContent />
    <CallSttWrapper />
    <audio ref={audioRef} autoPlay controls />
  </div>
);

const CallTopicContent = () => (
  <div css={styles.callTopicContent}>
    <div>topic</div>
    <div>questions</div>
  </div>
);

const CallSttWrapper = () => (
  <div css={styles.callSttWrapper}>
    <p>stt</p>
    <div css={styles.sttDivider} />
    <p>stt</p>
  </div>
);

const CallTagsContainer = (data: { tags: string[] }) => (
  <div css={styles.callTagsContainer}>
    {data.tags.map((tag) => (
      <span key={tag}>{tag}</span>
    ))}
  </div>
);

const CallControls = () => (
  <div css={styles.callControlsContainer}>
    <Mic />
    <EndCallButton />
  </div>
);

const EndCallButton = () => <PhoneOff css={styles.endCallButton} />;

export default VoiceCallView;
