import { http, HttpResponse } from 'msw';

export const handlers = [
  // 매칭 요청 핸들러
  http.post('/api/match-request', () => {
    return HttpResponse.json({
      matchId: 1,
      status: 'match_started',
      message: 'Match request sent successfully',
    });
  }),

  // 매칭 결과 조회 핸들러
  http.get('/api/match-result', async () => {
    let matchState = 'match_started';
    let matchedUser = null;
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 테스트를 위해 3초 대기
    matchState = 'match_found';
    matchedUser = {
      id: 2,
    };
    return HttpResponse.json({
      matchId: 1,
      status: matchState,
      matchedUser: matchedUser,
      message: 'Match result fetched successfully',
    });
  }),

  // 매칭 취소 핸들러
  http.delete('/api/match-cancel', ({ request }) => {
    const url = new URL(request.url);
    const matchId = url.searchParams.get('matchId');

    return HttpResponse.json({
      matchId: matchId,
      status: 'match_canceled',
      message: 'Match canceled successfully',
    });
  }),
];
