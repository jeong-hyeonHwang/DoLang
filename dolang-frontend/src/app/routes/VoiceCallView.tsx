import { RefObject, useEffect, useState } from 'react';
import { Mic, PhoneOff } from 'lucide-react';
import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import { usePeerContext } from '../../features/VoiceCall/hooks/usePeerContext.tsx';
import { CallTimer } from '@/features/VoiceCall/components/CallTimer.tsx';
import { styles } from '../../features/VoiceCall/components/styles.ts';
import { MatchedUser, Tag } from '@/features/Matching/types/Matching.type.ts';
import VoiceCallChat from '@/features/VoiceCall/components/VoiceCallChat.tsx';
import { useNavigate } from 'react-router';
import { User } from 'lucide-react';
import { useCallContext } from '@/features/VoiceCall/hooks/useCallContext.tsx';
import { useQuestionPrompt } from '@/features/Prompt/hooks/useQuestionPrompt.ts';
import { css } from '@emotion/react';

function VoiceCallView() {
  const { audioRef } = usePeerContext();
  const { matchingResult } = useStompClientContext();

  const { data: questionsData } = useQuestionPrompt({
    interestA: matchingResult?.me?.userTagList ?? [],
    interestB: matchingResult?.matchedUser?.userTagList ?? [],
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!matchingResult) navigate('/');
  }, [matchingResult, navigate]);

  const handleNextQuestion = () => {
    if (questionsData && questionsData.result.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % questionsData.result.length);
    }
  };

  if (!matchingResult) return null;

  return (
    <div css={styles.voiceCallView}>
      {/* 통화 참여자 & 오디오 */}
      <div css={styles.callParticipantsContainer}>
        <CallTimer />
        {matchingResult && (
          <>
            <CallParticipant user={matchingResult.me} />
            <CallTopic
              audioRef={audioRef}
              tags={[...matchingResult.matchedUser.userTagList, ...matchingResult.me.userTagList]}
              question={questionsData?.result[currentIndex] ?? '질문을 불러오는 중...'}
              onNextQuestion={handleNextQuestion}
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
    {user.profileImageUrl ? <img src={user.profileImageUrl} css={styles.userImage} alt="user" /> : <User size={100} />}
    <div css={styles.userInfo}>
      <span>{user.nickname}</span>
      <span className={`fi fi-${user.countryId}`} css={styles.countryFlag} />
    </div>
  </div>
);

const CallTopic = ({
  audioRef,
  tags,
  question,
  onNextQuestion,
}: {
  audioRef: RefObject<HTMLAudioElement>;
  tags: string[];
  question: string;
  onNextQuestion: () => void;
}) => (
  <div css={styles.callTopicContainer}>
    <CallTagsContainer tags={tags} />
    <CallTopicContent question={question} onNextQuestion={onNextQuestion} />
    <CallSttWrapper />
    <audio ref={audioRef} autoPlay controls style={{ visibility: 'hidden' }} />
  </div>
);

const CallTopicContent = ({ question, onNextQuestion }: { question: string; onNextQuestion: () => void }) => (
  <div css={styles.callTopicContent}>
    <div>{question}</div>
    <button onClick={onNextQuestion} css={nextQuestionButtonStyle}>
      다음 질문
    </button>
  </div>
);

const nextQuestionButtonStyle = css`
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
`;


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
      <span key={tag.tagId}>#{tag.translatedName}</span>
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
  const { endCall } = useCallContext();

  const handleEndCall = () => {
    endCall();
    navigate('/endcall');
  };

  return <PhoneOff css={styles.endCallButton} onClick={handleEndCall} />;
};

export default VoiceCallView;
