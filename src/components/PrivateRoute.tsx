
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

/**
 * PrivateRoute - Components for protecting routes that require authentication
 * Using console logs instead of visual alerts
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log authentication status with console feedback
  console.log(`[ROUTE] PrivateRoute check: Auth=${isAuthenticated}, Loading=${isLoading}, Path=${location.pathname}`);
  
  // Step 1: Let's just show the loading state properly with console feedback
  if (isLoading) {
    console.log('[ROUTE] Carregando estado de autenticação...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-3 text-blue-500">Verificando autenticação...</div>
      </div>
    );
  }
  
  // Step 2: If not authenticated, redirect to login with console feedback
  if (!isAuthenticated) {
    console.log('[ROUTE] Não autenticado, redirecionando para login...');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Step 3: If authenticated, allow access with console feedback
  console.log('[ROUTE] Autenticado com sucesso, permitindo acesso');
  return <Outlet />;
};
