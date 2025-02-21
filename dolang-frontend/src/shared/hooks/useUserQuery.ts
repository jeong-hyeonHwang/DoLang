import { userGet } from '@/api/utils/useUser';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { UserProfileData } from '@/app/routes/UserProfile/UserProfile';

export const useUserQuery = () => {
  const token = Cookies.get('access_token');
  return useQuery<UserProfileData | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const user = await userGet();
      return user.result;
    },
    enabled: !!token,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
