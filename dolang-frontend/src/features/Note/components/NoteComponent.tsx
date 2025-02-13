import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { PencilIcon, SearchIcon } from 'lucide-react';
import { useNoteListQuery } from '@/features/Note/hooks/useNoteListQuery';
import { NoteResponse } from '@/features/Note/types/Note.type';
import { useNoteWithKeywordQuery } from '../hooks/useNoteWithKeywordQuery';
import Cookies from 'js-cookie';

export const NoteComponent = () => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleNoteOpen = () => setIsNoteOpen((prev) => !prev);
  const handleNoteClose = () => setIsNoteOpen(false);

  const { data: noteData, isError: isNoteError } = useNoteListQuery();
  const { data: searchResults, refetch, isFetching: isSearchingData } = useNoteWithKeywordQuery(keyword);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        noteRef.current &&
        !noteRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleNoteClose();
      }
    };
    if (isNoteOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNoteOpen]);

  if (Cookies.get('access_token') === null) {
    return null;
  }
  return (
    <div css={floatingContainer}>
      <button ref={buttonRef} onClick={handleNoteOpen} css={[floatingButton, isNoteOpen && floatingButtonActive]}>
        <PencilIcon />
      </button>

      {isNoteOpen && (
        <div ref={noteRef} css={noteContainer}>
          <NoteInput setKeyword={setKeyword} refetch={refetch} setIsSearching={setIsSearching} />
          <NoteList noteData={isSearching ? searchResults : noteData} isSearching={isSearchingData} />
        </div>
      )}
    </div>
  );
};

const NoteList = ({ noteData, isSearching }: { noteData?: NoteResponse[]; isSearching: boolean }) => {
  if (isSearching) {
    return <p>검색 중...</p>;
  }

  if (!noteData || noteData.length === 0) {
    return <p>저장된 노트가 없습니다.</p>;
  }

  return (
    <>
      {noteData.map((data, index) => (
        <NoteContent key={index} data={data} />
      ))}
    </>
  );
};

const NoteContent = ({ data }: { data: NoteResponse }) => {
  return (
    <div css={noteContentWrapper}>
      <div css={noteHeader}>
        <span>{data.nativeLanguageId.toUpperCase()}</span>
        <span>{data.interestLanguageId.toUpperCase()}</span>
      </div>
      <textarea defaultValue={data.nativeNote} css={noteTextArea} />
      <textarea defaultValue={data.interestNote} css={noteTextArea} />
    </div>
  );
};

const NoteInput = ({
  setKeyword,
  refetch,
  setIsSearching,
}: {
  setKeyword: (keyword: string) => void;
  refetch: () => void;
  setIsSearching: (state: boolean) => void;
}) => {
  const textAreaRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const value = textAreaRef.current?.value;
    if (value) {
      setKeyword(value);
      setIsSearching(true);
      refetch();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input css={noteTextArea} type="text" ref={textAreaRef} placeholder="검색어 입력" />
      <SearchIcon cursor="pointer" onClick={handleSearch} />
    </div>
  );
};

const floatingContainer = css`
  position: fixed;
  bottom: 20px;
  height: 90vh;
  right: 20px;
  z-index: 1000;
`;

const floatingButton = css`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  z-index: 1000;
`;

const floatingButtonActive = css`
  width: 40px;
  height: 40px;
`;

const noteContainer = css`
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 80vh;
  width: 40vw;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

const noteContentWrapper = css`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 10px;
`;

const noteHeader = css`
  display: flex;
  gap: 10px;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
`;

const noteTextArea = css`
  border: none;
  resize: none;
  width: 100%;
  font-size: 16px;
  padding: 8px;
  outline: none;
  background: #f7f7f7;
`;
