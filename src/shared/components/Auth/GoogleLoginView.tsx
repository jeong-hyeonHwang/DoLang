import { useState, useEffect } from 'react';
import GoogleLogin from '@/shared/components/Auth/GoogleLogin';
import GoogleLogout from '@/shared/components/Auth/GoogleLogout';

function GoogleLoginView() {
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));

  useEffect(() => {
    const checkIsLogin = () => {
      const token = sessionStorage.getItem('access_token');
      setAccessToken(token);
    };

    window.addEventListener('storage', checkIsLogin);
    const interval = setInterval(checkIsLogin, 1);

    return () => {
      window.removeEventListener('storage', checkIsLogin);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {accessToken ? (
        <>
          <p>로그인 성공</p>
          <GoogleLogout />
        </>
      ) : (
        <GoogleLogin />
      )}
    </>
  );
}
export default GoogleLoginView;
