import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');

const token = accessToken;

export const tagsGet = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/user/tags`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
