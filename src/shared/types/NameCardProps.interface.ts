import { ReactNode } from 'react';
import { UserInfo } from './UserInfo.types';

export interface NameCardProps {
  userInfo: UserInfo;
  children?: ReactNode;
  style?: string;
}
