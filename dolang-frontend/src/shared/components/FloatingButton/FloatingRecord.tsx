import React, { useState } from 'react';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  background-color: black;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Tag = styled.span`
  background-color: gray;
  padding: 10px;
  border-radius: 5px;
`;

const Subject = styled.h1`
  margin: 20px 0;
`;

const Question = styled.div`
  background-color: #444;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const MessageInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  resize: none;
  background-color: #333;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #555;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #777;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff4081;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #ff79b0;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  bottom: 80px; /* Floating 버튼 바로 위에 위치 */
  right: 20px;
  background-color: #222;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  width: 300px;
  max-height: 70vh; /* 최대 높이 설정 */
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    color: #ff4081;
  }
`;

const RecordInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #333;
  color: white;
  margin-bottom: 10px;
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column-reverse; /* 리스트가 위로 쌓이게끔 */
  margin-top: 10px;
  max-height: 200px; /* 최대 높이 설정 */
  overflow-y: auto;
`;

const RecordItem = styled.div`
  background-color: #444;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
  position: relative;
`;

const DeleteButton = styled.button`
  background: none;
  color: red;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    color: darkred;
  }
`;

const FloatingRecord = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addRecord = () => {
    if (inputValue) {
      setRecords([inputValue, ...records]); // 위로 쌓이게
      setInputValue('');
    }
  };

  const deleteRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  return (
    <>
      <FloatingButton onClick={() => setIsModalOpen(true)}>+</FloatingButton>
      {isModalOpen && (
        <ModalContainer>
          <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          <h2>기록장</h2>
          <RecordList>
            {records.map((record, index) => (
              <RecordItem key={index}>
                {record}
                <DeleteButton onClick={() => deleteRecord(index)}>삭제</DeleteButton>
              </RecordItem>
            ))}
          </RecordList>
          <RecordInput
            style={{ marginTop: '1rem' }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="단어를 입력하세요..."
          />
          <Button onClick={addRecord}>저장</Button>
        </ModalContainer>
      )}
    </>
  );
};

export default FloatingRecord;
