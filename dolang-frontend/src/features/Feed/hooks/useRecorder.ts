import { useState, MutableRefObject, useRef, useEffect, useMemo } from 'react';

// 일단 음성녹음해야됨
// 물론 녹음완료후 비동기로 처리해야하지
// 그러니까 세션이 유지되는 동안 유저가 재생한 파일을 클라에서 가지고 있으면 좋겠다

// 1. 녹음버튼 누르면 녹음 시작
// 2. 녹음 중 실시간으로 파형을 보여줘야함 근데 wavesurfer로 어케 실시간 표시해야될지 잘몰겠음
// 3. 녹음완료되면 유저가 다시 들어볼수있다 이틈에 프로세싱 할수있으면 좀한다
// 4-  유저가 ㅇㅋ하면 서버에 전송한다 전송할때 데이터랑 메타데이터랑 같이보낸다
// 5. 녹음완료된 파일을 서버에 전송한다 최대한빨리 유저가 새로고침하기전에 안그럼 메모리 해제돼서 못들음
// 6-c. 클라는 녹음완료 파형이나 UI나 아무거나 결과물가지고 렌더링한다 그거 마운트되면 로컬데이터 있는지 확인하고 있으면 그거쓰고 없으면 서버한테 달라고그런다

// 7. 서버는 blob 받아서 S3로 보내서 저장함
// 8. 유저가 다음에 자기나 남의 기록을 듣고싶으면 마이페이지에서 볼수있다
// 9. 근데 짧다고는 해도 wav니까 용량 빡세다
// 10. 그렇다면 답은 m4a나 opus다 용량적고 퀄이 좋아야한다

// 11. 서버가 클라에 음성파일 보낼때는 S3에서 가져온 다음 blob으로 쏴준다
// 12. 클라는 받은 blob을 재생함
// ㅇㅋ 설계완료

interface UseRecordingReturn {
  isRecording: boolean;
  audioUrl: string | null;
  audioChunks: Blob[];
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  completeRecording: () => void;
  stopRecording: () => void;
}

export default function useFeedParticipation(): UseRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      };
      const recorder = new MediaRecorder(stream, options);
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) setAudioChunks((prev) => [...prev, event.data]);
      });

      // 녹음 시작
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  // 녹음 일시중지랑 완전중지가 있어야함
  // 일시정지는 잠깐멈춤
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsRecording(false);
    }
  };

  // 녹음 재개
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsRecording(true);
    }
  };

  // 녹음완료
  const completeRecording = () => {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 완전중지는 녹음 중지 및 녹음 트랙 정리
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')
    ) {
      // 메모리 누수 방지를 위해 MediaStream의 모든 트랙을 정리하고 mediaRecorder 참조를 해제
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setAudioChunks([]);
    }
  };

  // 녹음완료된 데이터를 Blob URL로 변환해서 반환함
  const audioUrl = useMemo(() => {
    if (audioChunks.length === 0) return null;
    const blob = new Blob(audioChunks, { type: 'audio/ogg' });
    return URL.createObjectURL(blob);
  }, [audioChunks]);

  // 컴포넌트 언마운트 또는 audioUrl 변경시 이전 URL 해제해서 메모리 누수 방지함
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return {
    isRecording,
    audioUrl,
    audioChunks,
    mediaRecorderRef,
    startRecording,
    pauseRecording,
    resumeRecording,
    completeRecording,
    stopRecording,
  };
}
