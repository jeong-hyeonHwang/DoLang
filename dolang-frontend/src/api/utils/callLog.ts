import Cookies from 'js-cookie';
import axios from 'axios';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');

export const callLogGet = async (access_token?: string, pageNum: number, sizeNum: number) => {
  const token = access_token || accessToken;

  try {
    const response = await axios.get(`${SERVER_URL}/api/call/list?page=${pageNum}&size=${sizeNum}`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log('callLogGet', response);
    if (response.data.code === 200) {
      return response.data.result;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
