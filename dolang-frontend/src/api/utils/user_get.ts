import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');

export const userGet = async (access_token?: string) => {
  const token = access_token || accessToken;

  // if (!token) {
  //   console.error('No access token found');
  //   throw new Error('Access token is missing');
  // }

  try {
    const response = await axios.get(`${SERVER_URL}/api/user`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data;
    console.log('response', response);

    if (response.status === 200) {
      return responseData;
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
