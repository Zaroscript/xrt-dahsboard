import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const role = useAppSelector(state => state.auth.user?.role);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role !== 'admin' && role !== 'moderator') {
    return <Navigate to="/" state={{ from: location, error: 'forbidden' }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

