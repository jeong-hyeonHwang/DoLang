import { atom } from 'recoil';
import { User } from '../../shared/types/UserInfo.type';

export const userState = atom<User | null>({
  key: 'userState',
  default: {
    nickname: '홍길동',
    nationality: 'kr',
    nativeLanguage: 'ko',
    targetLanguage: 'en',
    proficiencyLevel: 'b1',
    interests: [
      { id: 1, nativeLanguageId: 'en', name: 'Sports' },
      { id: 2, nativeLanguageId: 'en', name: 'Gaming' },
      { id: 3, nativeLanguageId: 'en', name: 'Music' },
    ],
    profileImageUrl: '/placeholder.svg',
  },
});
