// GoogleCallback.tsx
import React, { useEffect } from 'react';

const GoogleCallback = () => {
  // URL에서 `code` 추출 함수
  const getCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  };

  // 서버로 `code`를 전송하는 함수
  const sendCodeToServer = async (code: string) => {
    try {
      const response = await fetch('http://localhost:8000/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization Header': import.meta.env.VITE_AUTOHRIZATION_HEADER,
        },
        body: JSON.stringify({
          code,
          //   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          //   client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
          redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code', // authorization_code grant type 사용
        }),
      });

      if (!response.ok) {
        throw new Error('서버 요청에 실패했습니다.');
      }

      const data = await response.json(); // 서버로부터 받은 JSON 응답을 파싱
      console.log('Access Token:', data); // Access Token 처리
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  // `code`가 URL에 있을 경우 처리
  useEffect(() => {
    const code = getCodeFromUrl();
    if (code) {
      console.log('Authorization Code:', code); // `code`를 콘솔에 출력
      sendCodeToServer(code); // `code`를 서버로 전송
    }
  }, []);

  return <div>로그인 중...</div>;
};

export default GoogleCallback;
