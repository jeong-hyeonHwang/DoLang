import useFeedParticipation from '../hooks/useFeedParticipation';

const TestRecorder = () => {
  const {
    isRecording,
    audioUrl,
    audioChunks,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    completeRecording,
  } = useFeedParticipation();

  return (
    <div style={{ margin: '20px' }}>
      <h2>녹음 테스트</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={startRecording} disabled={isRecording}>
          Start
        </button>
        <button onClick={pauseRecording} disabled={!isRecording}>
          Pause
        </button>
        <button onClick={resumeRecording} disabled={isRecording}>
          Resume
        </button>
        <button onClick={stopRecording} disabled={!isRecording && !audioChunks.length}>
          Stop
        </button>
        <button onClick={completeRecording} disabled={!isRecording && !audioChunks.length}>
          Complete
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => {}} disabled={!audioUrl}>
          Play
        </button>
        <button onClick={() => {}} disabled={!audioUrl}>
          Upload
        </button>
      </div>

      {audioUrl && (
        <p style={{ marginTop: '10px' }}>
          <strong>Audio URL:</strong> {audioUrl}
        </p>
      )}
    </div>
  );
};

export default TestRecorder;
