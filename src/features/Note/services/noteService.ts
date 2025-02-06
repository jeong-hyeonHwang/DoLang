import axios from 'axios';
import { Note } from '../types/Note.type';

export const noteService = () => {
  // /api/note/
  // POST 요청 시 문장or단어를 저장한다.
  // (userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId 필요)
  const saveNote = async (note: Note) => {
    const response = await axios.post('/api/note/', note);
    return response.data;
  };

  // /api/note/{userId}
  // GET 요청 시 userId 기반으로 문장or단어들을 List에 담아 보낸다.
  // (id(ES 문서 id), userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId, createdAt)
  const getNoteList = async (userId: number) => {
    const response = await axios.get(`/api/note/${userId}`);
    return response.data;
  };

  // /api/note/{userId}/search?keyword=
  // GET 요청 시 userId, keyword 기반으로 문장or단어들 중 접두가 포함된 결과들을 List에 담아 보낸다.
  // (id(ES 문서 id), userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId, createdAt)
  const getNoteListWithKeyword = async (userId: number, keyword: string) => {
    const response = await axios.get(`/api/note/${userId}/search?keyword=${keyword}`);
    return response.data;
  };

  return { saveNote, getNoteList, getNoteListWithKeyword };
};
