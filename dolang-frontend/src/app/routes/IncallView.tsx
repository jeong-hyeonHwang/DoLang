import { useStompClientContext } from '../../features/Matching/hooks/useClientContext.tsx';
import React from 'react';

export const InCallView = () => {
  const { matchedUser } = useStompClientContext();
  return <div>{matchedUser?.username}</div>;
};
