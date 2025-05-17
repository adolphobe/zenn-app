
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute - Modified to temporarily allow access without authentication
 * This removes the redirect loop while we debug the authentication issues
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Temporarily allow all access regardless of authentication status
  return <Outlet />;
};
