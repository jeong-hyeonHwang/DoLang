import axios from 'axios';
import { MyFeedRequest, MyFeedResponse } from '../types';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('access_token');
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

// 내 피드 요청
// http://localhost:8100/api/myfeed?page=0&lang=en
export const getMyFeed = async (params: Partial<MyFeedRequest>): Promise<MyFeedResponse> => {
  try {
    const response = await instance.get('api/myfeed', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
