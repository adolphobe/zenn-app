
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import LoadingAuth from './login/LoadingAuth';

/**
 * PrivateRoute - Components for protecting routes that require authentication
 * Using detailed console logs for better debugging
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log(`[AUTH:ROUTE] PrivateRoute montado: Caminho=${location.pathname}`);
    return () => {
      console.log(`[AUTH:ROUTE] PrivateRoute desmontado: Caminho=${location.pathname}`);
    };
  }, [location.pathname]);
  
  // Log authentication status with detailed console feedback
  console.log(`[AUTH:ROUTE] Verificação de rota privada: Auth=${isAuthenticated}, Loading=${isLoading}, Path=${location.pathname}`);
  
  // Step 1: Show loading state with console feedback
  if (isLoading) {
    console.log('[AUTH:ROUTE] Estado de autenticação em carregamento...');
    return <LoadingAuth />;
  }
  
  // Step 2: If not authenticated, redirect to login with console feedback
  if (!isAuthenticated) {
    console.log('[AUTH:ROUTE] Usuário não autenticado, redirecionando para login...');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Step 3: If authenticated, allow access with console feedback
  console.log('[AUTH:ROUTE] Usuário autenticado com sucesso, permitindo acesso à rota privada');
  return <Outlet />;
};

export default PrivateRoute;
