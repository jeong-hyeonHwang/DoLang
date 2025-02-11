import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

interface ImportMetaEnv {
  readonly VITE_USER_REDIRECT_URI: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const REDIRECT_URI = import.meta.env.VITE_USER_REDIRECT_URI;
const accessToken = Cookies.get('access_token');

const token = accessToken;

export const tagsGet = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await fetch(`${REDIRECT_URI}/api/user/tags`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};
