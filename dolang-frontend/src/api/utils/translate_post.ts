import axios from 'axios';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Interest = {
  tagId: number;
  name: string;
};
interface PostData {
  text: string[];
  target_lang: string;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');
// const token = accessToken;

export const translatePost = async (data: string, target_lang: string, access_token?: string) => {
  const token = access_token || accessToken;

  try {
    const requestData: PostData = {
      text: [data],
      target_lang: target_lang,
    };

    const response = await axios.post(`${SERVER_URL}/api/translate`, requestData, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // const responseData = response.data;
    if (response.data.code === 200) {
      return response;
    }
  } catch (error: any) {
    console.error('Error', error);
    const errorMessage = error.response?.data?.message || '다시 시도해주세요.';
    alert(errorMessage);
  }
};
