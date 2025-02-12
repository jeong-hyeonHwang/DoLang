import Cookies from 'js-cookie';

export const setLoginCookie = (token: string) => {
  Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Strict' });
};

export const getLoginCookie = () => {
  return Cookies.get('auth_token');
};

export const removeLoginCookie = () => {
  Cookies.remove('auth_token');
};
