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
  nickname: string;
  nationality: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: Interest[];
  agreement: boolean;
  profileImageUrl?: string;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');
// const token = accessToken;

export const translatePost = async (data: PostData, access_token?: string) => {
  const token = access_token || accessToken;

  try {
    const response = await axios.post(`${SERVER_URL}/api/translate`, data, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    // const responseData = response.data;
    if (response.data.code === 200) {
      return response;
    }
  } catch (error: any) {
    console.error('Error', error);
    const errorMessage = error.response?.data?.message || '회원가입을 다시 시도해주세요.';
    alert(errorMessage);
  }
};
