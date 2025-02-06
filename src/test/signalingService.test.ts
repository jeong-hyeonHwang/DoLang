import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { describe, test, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { getMatchResult, matchRequest, handleMatchCancel } from '../features/Matching/services/signalingService';

const server = setupServer(...handlers);

describe('시그널링 서비스 API 요청 테스트', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('매칭 요청 후 폴링을 통해  매칭이 시작되어야 함', async () => {
    const response = await matchRequest({
      user: { id: 1, name: '홍길동', flag: 'kr', image: null },
      interests: ['interest1', 'interest2'],
    });
    expect(response.status).toBe('match_started');
  });

  test('매칭 결과 조회 후 폴링을 통해 match_found 상태가 되고 웹소켓 연결이 호출되어야 한다', async () => {
    const response = await getMatchResult(1);
    expect(response.status).toBe('match_found');
  });

  test('매칭 취소 후 폴링을 통해 match_canceled 상태가 되어야 함', async () => {
    const response = await handleMatchCancel(1);
    expect(response.status).toBe('match_canceled');
  });
});
