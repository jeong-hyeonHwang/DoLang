import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from './authState.ts';
import { useNavigate } from 'react-router';
import { removeLoginCookie } from '../../api/utils/cookies.ts';

function GoogleLogout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(authState);

  const handleGoogleLogout = () => {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    removeLoginCookie();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');

    setIsLoggedIn({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });

    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return <>{isLoggedIn ? <button onClick={handleGoogleLogout}>로그아웃</button> : null}</>;
}

export default GoogleLogout;
