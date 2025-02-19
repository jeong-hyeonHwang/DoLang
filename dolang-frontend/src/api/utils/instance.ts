import axios from 'axios';
import Cookies from 'js-cookie';

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // 기본 값
  },
});

// 요청 타입에 따라 동적으로 헤더 설정
apiInstance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');

  // 인증이 필요한 경우 자동으로 Authorization 헤더 추가
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // multipart/form-data 요청인지 확인
  if (config.data instanceof FormData) config.headers['Content-Type'] = 'multipart/form-data';

  return config;
});
