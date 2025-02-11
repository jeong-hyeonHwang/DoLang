import { atom } from 'recoil';
import type { User } from '../../shared/types/UserInfo.type';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    user: null,
  },
});

// export const authState = atom<AuthState>({
//   key: 'authState',
//   default: {
//     isLoggedIn: !!document.cookie.split('; ').find((row) => row.startsWith('access_token=')),
//     accessToken:
//       document.cookie
//         .split('; ')
//         .find((row) => row.startsWith('access_token='))
//         ?.split('=')[1] || null,
//     refreshToken:
//       document.cookie
//         .split('; ')
//         .find((row) => row.startsWith('refresh_token='))
//         ?.split('=')[1] || null,
//   },
// });
