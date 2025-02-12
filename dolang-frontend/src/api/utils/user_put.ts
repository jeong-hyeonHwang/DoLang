import axios from 'axios';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('access_token');

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const token = accessToken;

export const userPut = async (data: string, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/user`, {
      method: 'PUT',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};
