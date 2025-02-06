import { http, HttpResponse } from 'msw';

type UserInfo = {
  userName: string;
  userFlag: string;
  userImage: string | null;
};

export const handlers = [
  // 유저 정보 조회 핸들러
  http.get('/api/user', () => {
    const data: UserInfo = {
      userName: '홍길동',
      userFlag: 'kr',
      userImage: null,
    };
    return HttpResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // 로그아웃 핸들러
  http.post('/api/logout', () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    });
  }),

  // 로그인 핸들러
  http.post('/api/login', () => {
    return HttpResponse.json({
      message: 'Logged in successfully',
    });
  }),

];
