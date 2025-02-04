import React, { useEffect } from 'react';
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

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${AUTH_SERVER_URL}/oauth2/authorize?
    response_type=code
    &client_id=${CLIENT_ID}
    &redirect_uri=${REDIRECT_URI}
    &scope=openid`.replace(/\s+/g, '');
    // &scope=openid email`.replace(/\s+/g, '');

    window.location.href = googleAuthUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // console.log('Authorization code: ', code);
      window.history.replaceState({}, '', window.location.pathname);
      codeForToken(code);
    }
  }, []);

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
      });

      const data = await response.json();
      // console.log('Token Response: ', data);
      // console.log('Access Token Response: ', data.access_token);
      // console.log('Refresh Token Response: ', data.refresh_token);

      if (data.access_token) {
        sessionStorage.setItem('access_token', data.access_token);
        // checkNewUser(data.access_token);
      }
    } catch (err) {
      console.error('Error code for Token: ', err);
    }
  };

  // const checkNewUser = async (accessToken: string) => {
  //   try {
  //     const response = await fetch(`new user check api`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     const userData = await response.json();
  //     console.log('Google User Info: ', userData);

  //     if (userData.email) {
  //       verifyUserOnBackend(userData.email);
  //     }
  //   } catch (err) {
  //     console.error('Error check newUser: ', err);
  //   }
  // };

  // const verifyUserOnBackend = async (userEmail: string) => {
  //   try {
  //     const response = await fetch(`verifyUserAPI`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userEmail }),
  //     });

  //      const result = await response.json();
  //      if (result.exists) {
  //        console.log('기존 유저');
  //        navigate('/', { replace: true });
  //     } else {
  //       console.log('New 유저');
  //       navigate('/signup', { replace: true });
  //     }
  //   } catch (err) {
  //     console.error('Error verify User: ', err);
  //   }
  // };

  return <button onClick={handleGoogleLogin}>Google 로그인</button>;
};
export default GoogleLogin;
