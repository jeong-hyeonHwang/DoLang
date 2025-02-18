import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery, useMutation } from 'react-query';
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

  try {
    const response = await axios.get(`${SERVER_URL}/api/user`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data;
    // console.log('response', response);

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

const updateUser = async (data: string, access_token?: string) => {
  const token = access_token || accessToken;

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

    const responseData = await response.json();

    if (response.status === 200) {
      return responseData;
    } else {
      throw new Error('Failed to update user data');
    }
  } catch (error: any) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

export const useUser = () => {
  return useQuery('user', () => userGet(), {
    enabled: !!accessToken,
  });
};

export const useUpdateUser = () => {
  return useMutation(updateUser);
};
