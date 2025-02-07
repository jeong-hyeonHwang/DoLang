import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: () => axios.post('/api/login'),
    onSuccess: (res) => {
      const { accessToken, refreshToken } = res.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => axios.post('/api/logout'),
    onSuccess: () => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
    },
  });

  return { loginMutation, logoutMutation };
};
