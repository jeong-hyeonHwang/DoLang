import { atom } from 'recoil';

export const authState = atom<boolean>({
  key: 'authState',
  default: !!document.cookie.split('; ').find((row) => row.startsWith('access_token=')),
});
