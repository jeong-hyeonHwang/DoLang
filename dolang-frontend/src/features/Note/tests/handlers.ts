import { http, HttpResponse } from 'msw';

export const handlers = [
  // API 호출 시, 북마크 여부 확인 로직 상세
  // try-catch와 Transactional를 통해 데이터 무결성을 보장
  // (MySQL부터 저장을 시도, ElasticSearch 저장 시도하는 방식으로 구현 (ES는 ACID 보장 X), User의 존재 여부 확인)

  // userId가 동일한 기록들을 반환. ES로 먼저 시도하고, 실패 시 MySQL로 시도.

  // ES에서 userId가 동일한지 먼저 확인 후 동일하다면 nativeNote, interestNote에 접두를 포함하는 단어가 있는지 확인.
  // (현재 한글의 경우 "안녕"을 검색하기 위해서는 "안"까지 입력해야 한다. 해당 부분은 document의 setting 수정으로 "ㅇ", "아" 만으로도 검색 가능하게 할 수 있으나 현재는 보류.)

  // /api/note/
  // POST 요청 시 문장or단어를 저장한다.
  // (userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId 필요)
  http.post('/api/note/', async () => {
    return HttpResponse.json({
      message: 'Note saved successfully',
      status: 200,
    });
  }),
  // /api/note/{userId}
  // GET 요청 시 userId 기반으로 문장or단어들을 List에 담아 보낸다.
  // (id(ES 문서 id), userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId, createdAt)
  http.get('/api/note/:userId', async () => {
    return HttpResponse.json({
      message: 'Note list fetched successfully',
      status: 200,
    });
  }),
  // /api/note/{userId}/search?keyword=
  // GET 요청 시 userId, keyword 기반으로 문장or단어들 중 접두가 포함된 결과들을 List에 담아 보낸다.
  // (id(ES 문서 id), userId, nativeNote, interestNote, nativeLanguageId, interestLanguageId, createdAt)
  http.get('/api/note/:userId/search', async () => {
    return HttpResponse.json({
      message: 'Note list fetched successfully',
      status: 200,
    });
  }),
];
