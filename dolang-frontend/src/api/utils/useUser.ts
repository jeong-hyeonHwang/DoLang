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

// 유저 데이터를 가져오는 함수
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

// 유저 데이터를 업데이트하는 함수
const updateUser = async (data: string, access_token?: string) => {
  const token = access_token || accessToken; // token을 전달받거나, 쿠키에서 가져옵니다.

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

    const responseData = await response.json(); // 응답 데이터를 json 형태로 받습니다.

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

// `useQuery` 훅을 사용해 유저 정보를 가져오는 함수
export const useUser = () => {
  return useQuery('user', () => userGet(), {
    enabled: !!accessToken, // access_token이 있는 경우에만 활성화
  });
};

// `useMutation` 훅을 사용해 유저 정보를 업데이트하는 함수
export const useUpdateUser = () => {
  return useMutation(updateUser);
};
