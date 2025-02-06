import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from '@jest/globals';
import { useMatching } from '../hooks/useMatching';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return QueryClientWrapper;
};

const server = setupServer(...handlers);

describe('useMatching 훅 테스트', () => {
  // MSW 서버 라이프사이클
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('매칭 요청 후 폴링을 통해 match_found 상태가 되고 웹소켓 연결이 호출되어야 한다', async () => {
    // connectWebSocket 함수의 호출 여부를 감시 (내부에서 콘솔 출력)
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // React Query Provider로 감싼 환경에서 useMatching 훅 실행
    const { result } = renderHook(() => useMatching(), { wrapper: createWrapper() });

    // startMatching을 호출하여 매칭 요청
    await result.current.startMatching({
      user: { id: 1, name: '홍길동', flag: 'kr', image: null },
      interests: ['interest1', 'interest2'],
    });

    // 폴링으로 인한 matchResult 업데이트가 이루어질 때까지 대기
    await waitFor(
      () => {
        if (result.current.matchingStatus) {
          expect(result.current.matchingStatus).toBe('match_found');
        }
      },
      { timeout: 3000 }
    );

    // 매칭 성공 시 connectWebSocket 함수가 호출되어야 함
    expect(consoleSpy).toHaveBeenCalledWith('웹소켓 연결', 1);

    // 스파이 정리
    consoleSpy.mockRestore();
  });
});
