import { ReactNode } from 'react';
import { UserInfo } from './UserInfo.type';

export interface NameCardProps {
  userInfo: UserInfo;
  children?: ReactNode;
  style?: string;
}
