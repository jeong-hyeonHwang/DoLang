// export interface Interest {
//   tagId: number;
//   tagName: string;
// }

export interface Interest {
  id: number;
  nativeLanguageId: string;
  name: string;
}

export interface User {
  profileImageUrl?: string | null;
  nickname: string;
  nationality: string;
  nativeLanguage: string | null;
  targetLanguage: string | null;
  proficiencyLevel: string | null;
  interests: Interest[];
}
