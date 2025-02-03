import React from 'react';

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const params = new URLSearchParams(window.location.search);
const code = params.get('code');
console.log(code);

const GoogleLogin = () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const handleGoogleLogin = () => {
    const googleAuthUrl = `http://localhost:8200/oauth2/authorize?
    response_type=code
    &client_id=${CLIENT_ID}
    &redirect_uri=${REDIRECT_URI}
    &scope=openid`.replace(/\s+/g, '');

    window.location.href = googleAuthUrl;
  };
  return <button onClick={handleGoogleLogin}>Google 로그인</button>;
};
export default GoogleLogin;
