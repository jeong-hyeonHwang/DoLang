import axios from 'axios';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('access_token');
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

export const postBookmark = async (feedId: number, postId: number) => {
  try {
    const response = await instance.post(`/api/post/${feedId}/${postId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postHeart = async (feedId: number, postId: number) => {
  try {
    const response = await instance.post(`/api/post/${feedId}/${postId}/heart`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
