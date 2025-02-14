import { RefObject, useEffect, useState } from 'react';
import { Mic, PhoneOff } from 'lucide-react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { usePeerContext } from '../../features/VoiceCall/hooks/usePeerContext.tsx';
import { styles } from '../../features/VoiceCall/components/styles.ts';
import { MatchedUser, Tag } from '@/features/Matching/types/Matching.type.ts';
import VoiceCallChat from '@/features/VoiceCall/components/VoiceCallChat.tsx';
import { useNavigate } from 'react-router';

function VoiceCallView() {
  const { audioRef } = usePeerContext();
  const { matchingResult } = useStompClientContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!matchingResult) navigate('/');
  });

  if (!matchingResult) return null;

  return (
    <div css={styles.voiceCallView}>
      {/* 통화 참여자 & 오디오 */}
      <div css={styles.callParticipantsContainer}>
        {matchingResult && (
          <>
            <CallParticipant user={matchingResult.me} />
            <CallTopic
              audioRef={audioRef}
              tags={[...matchingResult.matchedUser.userTagList, ...matchingResult.me.userTagList]}
            />
            <CallParticipant user={matchingResult.matchedUser} />
          </>
        )}
      </div>

      {/* 통화 컨트롤 버튼 */}
      <CallControls />
      <VoiceCallChat />
    </div>
  );
}

const CallParticipant = ({ user }: { user: MatchedUser }) => (
  <div css={styles.callParticipant}>
    <img src={user.profileImageUrl || ''} css={styles.userImage} />
    <div css={styles.userInfo}>
      <span>{user.nickname}</span>
      <span className={`fi fi-${user.countryId}`} css={styles.countryFlag} />
    </div>
  </div>
);

const CallTopic = ({ audioRef, tags }: { audioRef: RefObject<HTMLAudioElement>; tags: Tag[] }) => (
  <div css={styles.callTopicContainer}>
    <CallTagsContainer tags={tags} />
    <CallTopicContent topic={''} question={''} />
    <CallSttWrapper />
    <audio ref={audioRef} autoPlay controls />
  </div>
);

const CallTopicContent = ({ topic, question }: { topic: string; question: string }) => (
  <div css={styles.callTopicContent}>
    <div>{topic}</div>
    <div>{question}</div>
  </div>
);

const CallSttWrapper = () => {
  const [stt, setStt] = useState<string>('');
  const [translated, setTranslated] = useState<string>('');
  return (
    <div css={styles.callSttWrapper}>
      <p>{stt}</p>
      <div css={styles.sttDivider} />
      <p>{translated}</p>
    </div>
  );
};

const CallTagsContainer = ({ tags }: { tags: Tag[] }) => (
  <div css={styles.callTagsContainer}>
    {tags.map((tag) => (
      <span key={tag.tagId}>{tag.translatedName}</span>
    ))}
  </div>
);

const CallControls = () => (
  <div css={styles.callControlsContainer}>
    <Mic />
    <EndCallButton />
  </div>
);

const EndCallButton = () => {
  const navigate = useNavigate();
  return <PhoneOff css={styles.endCallButton} onClick={() => navigate('/endcall')} />;
};

export default VoiceCallView;
