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

export const userGet = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await fetch(`${REDIRECT_URI}/api/user`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text(); // 응답 내용을 텍스트로 확인
    console.log('Response Status:', response.status);
    console.log('Response Body:', responseText);

    if (response.ok) {
      alert('로그인 되었습니다.');
      navigate('/');
    } else if (response.status === 404) {
      navigate('/signup/register');
    } else {
      alert('다시 시도해주세요.');
    }
  } catch (error) {
    console.log('Error', error);
    alert('잠시 후 다시 시도해주세요.');
  }
};
