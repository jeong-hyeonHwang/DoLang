export type UserInfo = {
  profileImageUrl: string | null;
  nickname: string;
  countryId: string;
  nativeLanguageId: string | null;
  interestLanguageId: string | null;
  interestingLanguageLevelId: string | null;
  tags: Tag[];
};

export type Tag = {
  text: string;
};
