import { atom } from 'recoil';

// export const accessTokenState = atom<string | null>({
//   key: 'accessTokenState',
//   default: null,
// });

export const authState = atom<boolean>({
  key: 'authState',
  default: !!document.cookie.split('; ').find((row) => row.startsWith('access_token=')),
});
