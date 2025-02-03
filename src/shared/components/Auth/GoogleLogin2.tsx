import React, { useEffect } from 'react';

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
  readonly VITE_GOOGLE_AUTH_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const AUTH_SERVER_URL = import.meta.env.VITE_GOOGLE_AUTH_SERVER_URL;

const GoogleLogin2 = () => {
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
      console.log('Authorization code: ', code);
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
        },
        body: body.toString(),
      });

      const data = await response.json();
      console.log('Access Token Response: ', data);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  return <button onClick={handleGoogleLogin}>Google 로그인2</button>;
};
export default GoogleLogin2;
