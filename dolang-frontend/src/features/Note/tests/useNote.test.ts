import { setupServer } from 'msw/node';
import { noteService } from '../services/noteService.ts';
import { describe, expect, test, beforeAll, afterEach, afterAll } from '@jest/globals';
import { Note } from '../types/Note.type.ts';
import { handlers } from './handlers.ts';

const newNote: Note = {
  nativeNote: 'Hello',
  interestNote: '안녕하세요',
  nativeLanguageId: 'en',
  interestLanguageId: 'ko',
  userId: 1,
};

const { saveNote, getNoteList, getNoteListWithKeyword } = noteService();
const server = setupServer(...handlers);

describe('useNote', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test('요청 시 문장or단어를 저장해야 한다', async () => {
    const response = await saveNote(newNote);
    expect(response.status).toBe(200);
  });

  test('사용자 아이디 기반으로 문장or단어를 리스트에 담아 보내야 한다', async () => {
    const response = await getNoteList(1);
    expect(response.status).toBe(200);
  });

  test('GET 요청 시 userId, keyword 기반으로 문장or단어들 중 접두가 포함된 결과들을 List에 담아 보낸다.', async () => {
    const response = await getNoteListWithKeyword(1, '안녕');
    expect(response.status).toBe(200);
  });
});
