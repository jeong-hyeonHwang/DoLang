import { accessTokenState } from './authState';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from './authState';
import { useNavigate } from 'react-router';

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
  readonly VITE_GOOGLE_AUTH_SERVER_URL: string;
  readonly VITE_GOOGLE_AUTHORIZATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const AUTH_SERVER_URL = import.meta.env.VITE_GOOGLE_AUTH_SERVER_URL;
const AUTHORIZATION = import.meta.env.VITE_GOOGLE_AUTHORIZATION;

const GoogleLogin = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(authState);

  // 1. Authorization code 발급
  const handleGoogleLogin = () => {
    const googleAuthUrl = `${AUTH_SERVER_URL}/oauth2/authorize?
    response_type=code
    &client_id=${CLIENT_ID}
    &redirect_uri=${REDIRECT_URI}
    &scope=openid`.replace(/\s+/g, '');

    window.location.href = googleAuthUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // console.log('Authorization code: ', code);
      codeForToken(code);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 2. Authorization code로 Token 발급
  const codeForToken = async (code: string) => {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    });

    try {
      const response = await fetch(`${AUTH_SERVER_URL}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `${AUTHORIZATION}`,
        },
        body: body.toString(),
        credentials: 'include', //refresh token 쿠키로 저장
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log('Token Response: ', data);

      if (data.access_token && data.refresh_token) {
        // console.log('access_token: ', data.access_token);
        // console.log('refresh_token success: ', data.refresh_token);
        saveAccessTokenToCookie(data.access_token);
        saveRefreshTokenToCookie(data.refresh_token);

        setIsLoggedIn(true);
        setAccessToken(data.access_token);

        alert('로그인 되었습니다.');
        console.log('LogIn not_HttpOnly');
        navigate('/');
      }
    } catch (err) {
      console.error('Error code for Token: ', err);
    }
  };

  // 3-1. [Token 세션 쿠키 저장] Access Token
  const saveAccessTokenToCookie = (token: string) => {
    // document.cookie = `access_token=${token}; path=/; secure; HttpOnly; SameSite=Strict;`;
    document.cookie = `access_token=${token}; path=/; secure; SameSite=Strict;`;
    // console.log('access_token_cookie: ', document.cookie);
  };

  // 3-2. [Token 세션 쿠키 저장] Refresh Token
  const saveRefreshTokenToCookie = (token: string) => {
    // document.cookie = `refresh_token=${token}; path=/; secure; HttpOnly; SameSite=Strict;`;
    document.cookie = `refresh_token=${token}; path=/; secure; SameSite=Strict;`;
    // console.log('refresh_token_cookie: ', document.cookie);
  };

  // 4. Refresh Token으로 Access Token 갱신하기
  const refreshAccessToken = async () => {
    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) {
      console.error('No refresh token found');
      alert('로그인 해주세요.');
      navigate('/');
      return;
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(`${AUTH_SERVER_URL}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `${AUTHORIZATION}`,
        },
        body: body.toString(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh access token: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.access_token) {
        saveAccessTokenToCookie(data.access_token);
        saveRefreshTokenToCookie(data.refresh_token);
      }
    } catch (err) {
      console.error('Error refreshing token: ', err);
      alert('로그인 해주세요.');
      navigate('/');
    }
  };

  return <>{isLoggedIn ? <p>로그인 되었습니다.</p> : <button onClick={handleGoogleLogin}>Google 로그인</button>}</>;
};
export default GoogleLogin;
