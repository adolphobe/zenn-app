
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { checkAuthSecurely } from './authFix';
import { throttledLog } from '../utils/logUtils';

interface PrivateRouteProps {
  redirectPath?: string;
}

/**
 * Componente que protege rotas, permitindo acesso apenas a usuários autenticados
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  redirectPath = '/login'  
}) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  
  // Verificação de segurança adicional em cada renderização
  useEffect(() => {
    // Verifica diretamente os tokens sem contar com o estado do AuthContext
    const { isAuth } = checkAuthSecurely();
    
    if (!isAuth && isAuthenticated) {
      throttledLog("ROUTE-FIX", "Inconsistência detectada: tokens inválidos mas estado autenticado");
      // Forçar logout para corrigir estado
      logout();
    }
  }, [location.pathname, isAuthenticated, logout]);
  
  // Mostra um loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    throttledLog("ROUTE-FIX", "Não autenticado, redirecionando para login");
    return <Navigate 
      to={redirectPath} 
      state={{ from: location }} 
      replace 
    />;
  }
  
  // Se estiver autenticado, renderiza as rotas filhas
  throttledLog("ROUTE-FIX", "Autenticado, renderizando rota protegida:", location.pathname);
  return <Outlet />;
};
