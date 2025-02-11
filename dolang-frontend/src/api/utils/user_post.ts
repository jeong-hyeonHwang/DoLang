import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('access_token');

interface ImportMetaEnv {
  readonly VITE_USER_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const REDIRECT_URI = import.meta.env.VITE_USER_REDIRECT_URI;
const token = accessToken;

export const userPost = async (data: object, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await fetch(`${REDIRECT_URI}/api/user`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('회원가입이 완료되었습니다!');
      navigate('/signin');
    } else {
      alert('회원가입을 다시 시도해주세요.');
    }
  } catch (error) {
    console.log('Error', error);
    alert('회원가입을 다시 시도해주세요.');
  }
};
