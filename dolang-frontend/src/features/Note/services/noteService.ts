import axios from 'axios';
import Cookies from 'js-cookie';
import { NoteResponse, NoteRequest } from '@/features/Note/types/Note.type';

const instance = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('access_token')}`,
  },
});

// /api/note/
// POST 요청 시 문장or단어를 저장한다.
// (userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId 필요)
export const saveNote = async (note: NoteRequest) => {
  try {
    const response = await instance.post('/api/note', note);
    return response.data;
  } catch (error) {
    console.error('Note 저장 중 오류 발생:', error);
    throw error;
  }
};


// /api/note?page=1
// GET 요청 시 문장or단어들을 List에 담아 보낸다.
// (id(ES 문서 id), userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId, createdAt)
export const getNoteListPage = async (page?: number) => {
  try {
    const response = await instance.get<{ result: NoteResponse[] }>(`/api/note?page=${page}`);
    return response.data.result;
  } catch (error) {
    console.error('Note 목록 조회 중 오류 발생:', error);
    throw error;
  }
};



// /api/note/search?keyword=
// GET 요청 시 keyword 기반으로 문장or단어들 중 접두가 포함된 결과들을 List에 담아 보낸다.
// (id(ES 문서 id), userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId, createdAt)
export const getNoteListWithKeyword = async (keyword: string) => {
  try {
    const response = await instance.get<{ result: NoteResponse[] }>(`/api/note/search?keyword=${keyword}`);
    return response.data.result;
  } catch (error) {
    console.error('Note 검색 중 오류 발생:', error);
    throw error;
  }
};
