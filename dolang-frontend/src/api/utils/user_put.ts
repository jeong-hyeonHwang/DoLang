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

export const userPut = async (data: UserProfileData) => {
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

    // 🔥 401 에러 처리 (토큰 만료 시 로그아웃 처리)
    if (response.status === 401) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      Cookies.remove('access_token'); // 토큰 삭제
      sessionStorage.removeItem('user'); // 세션 데이터 삭제
      window.location.href = '/login'; // 로그인 페이지로 이동
      return null;
    }

    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    // 🔥 빈 응답 처리 (response.json() 실행 전 확인)
    const responseData = response.headers.get('content-type')?.includes('application/json')
      ? await response.json()
      : null;

    console.log('PUT 응답:', responseData);
    return responseData;
  } catch (error: any) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    alert('업데이트에 실패했습니다.');
  }
};

// import Cookies from 'js-cookie';

// const accessToken = Cookies.get('access_token');

// interface ImportMetaEnv {
//   readonly VITE_USER_SERVER_URL: string;
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }

// const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
// const token = accessToken;

// export const userPut = async (data: UserProfileData) => {
//   try {
//     const response = await fetch(`${SERVER_URL}/api/user`, {
//       method: 'PUT',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || '업데이트에 실패했습니다.');
//     }
//     console.log(response);
//     return await response.json();
//   } catch (error: any) {
//     console.error('프로필 업데이트 중 오류 발생: ', error.message);
//     alert(error.message);
//     return null;
//   }
// };

// =========================================
// import axios from 'axios';
// import { useNavigate } from 'react-router';
// import Cookies from 'js-cookie';

// const accessToken = Cookies.get('access_token');

// interface ImportMetaEnv {
//   readonly VITE_USER_SERVER_URL: string;
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }

// const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
// const token = accessToken;

// export const userPut = async (data: string, navigate: ReturnType<typeof useNavigate>) => {
//   try {
//     const response = await fetch(`${SERVER_URL}/api/user`, {
//       method: 'PUT',
//       headers: {
//         accept: '*/*',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });

//     const responseData = response;
//     console.log('put', responseData);
//     if (responseData.status === 200) {
//       return response;
//     } else {
//       alert('다시 시도해주세요.');
//     }
//   } catch (error: any) {
//     console.log('Error', error);
//     const errorMessage = error.response?.data?.message || '다시 시도해주세요.';
//     alert(errorMessage);
//   }
// };
