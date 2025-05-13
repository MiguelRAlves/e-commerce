import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(state => !!state.token);

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;