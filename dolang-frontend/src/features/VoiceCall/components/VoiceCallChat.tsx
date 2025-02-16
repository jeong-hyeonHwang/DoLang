import React, { useState } from 'react';
import { usePeerContext } from '../hooks/usePeerContext';

const VoiceCallChat = () => {
  const { messages, sendMessage } = usePeerContext();
  const [message, setMessage] = useState('');

  return (
    <div style={styles.chatContainer}>
      <h3>💬 실시간 채팅</h3>
      <div style={styles.chatBox}>
        {messages.length === 0 ? (
          <p style={styles.emptyMessage}>메시지가 없습니다.</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} style={msg.startsWith('📤') ? styles.myMessage : styles.otherMessage}>
              {msg}
            </p>
          ))
        )}
      </div>
      <div style={styles.chatInputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={styles.chatInput}
        />
        <button
          style={styles.sendButton}
          onClick={() => {
            if (message.trim()) {
              sendMessage(message);
              setMessage('');
            }
          }}
        >
          ➤ 전송
        </button>
      </div>
    </div>
  );
};

// 스타일 객체
const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    position: 'fixed',
    right: 0,
    height: '100vh',
  },
  chatBox: {
    overflowY: 'auto',
    border: '1px solid #ddd',
    flexGrow: 1,
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#fff',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
  },
  myMessage: {
    textAlign: 'right',
    color: '#007bff',
    margin: '5px 0',
  },
  otherMessage: {
    textAlign: 'left',
    color: '#343a40',
    margin: '5px 0',
  },
  chatInputContainer: {
    display: 'flex',
    marginTop: '10px',
  },
  chatInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  sendButton: {
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    marginLeft: '10px',
  },
};

export default VoiceCallChat;
