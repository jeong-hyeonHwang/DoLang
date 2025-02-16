import { ReactNode } from 'react';

export interface NameCardProps {
  userImage: string;
  userNickname?: string;
  userCountry: string;
  userNativeLanguage?: string;
  userInterestLanguage?: string;
  userInterestingLanguageLevel?: string;
  children?: ReactNode;
  style?: string;
}
