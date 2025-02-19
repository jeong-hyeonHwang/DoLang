import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { authState } from '@/features/Auth/authState';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn') || 'false');

  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !hasChecked.current) {
      hasChecked.current = true;
      alert('로그인이 필요합니다.');
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
