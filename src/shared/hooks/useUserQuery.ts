import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UserInfo {
  userName: string | null;
  userFlag: string | null;
  userImage: string | null;
}

export const useUserQuery = () => {
  const token = sessionStorage.getItem('accessToken');
  return useQuery<UserInfo | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/user', {});
        return res.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
