import axios from 'axios';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');
const token = accessToken;

export const userPost = async (data: object) => {
  console.log('token: ', accessToken);
  try {
    const response = await axios.post(`${SERVER_URL}/api/user`, data, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data;
    if (responseData.code === 200) {
      return response;
    } else {
      alert('다시 회원가입을 시도해주세요.');
    }
  } catch (error: any) {
    console.log('Error', error);
    const errorMessage = error.response?.data?.message || '회원가입을 다시 시도해주세요.';
    alert(errorMessage);
  }
};
