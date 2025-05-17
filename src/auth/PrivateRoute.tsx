
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getStoredAuth } from '../mock/authUtils';

interface PrivateRouteProps {
  redirectPath?: string;
}

/**
 * Componente que protege rotas, permitindo acesso apenas a usuários autenticados
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  redirectPath = '/login'  
}) => {
  const { isAuthenticated, isLoading, authError, logout, checkAuth } = useAuth();
  const location = useLocation();
  
  // Forçar verificação de autenticação ao montar o componente
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PrivateRoute: Inicializando proteção para rota "${location.pathname}"`);
    
    // Verificação forçada de token ao montar
    const { isValid } = getStoredAuth();
    if (!isValid && isAuthenticated) {
      console.log(`[${timestamp}] PrivateRoute: Inconsistência detectada - Token inválido mas isAuthenticated=true`);
      logout();
    } else {
      checkAuth();
    }
  }, [location.pathname, isAuthenticated, logout, checkAuth]);

  // Log de depuração para rastrear o estado de autenticação
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PrivateRoute: Status de autenticação para "${location.pathname}"`, {
      isAuthenticated,
      isLoading,
      authError
    });
  }, [isAuthenticated, isLoading, authError, location.pathname]);

  // Mostra um loader enquanto verifica a autenticação
  if (isLoading) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PrivateRoute: Carregando verificação de autenticação...`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se a sessão expirou, redireciona para login com mensagem específica
  if (authError === 'session_expired') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PrivateRoute: Sessão expirada, redirecionando para ${redirectPath}`);
    return <Navigate 
      to={redirectPath} 
      state={{ 
        from: location,
        authError: 'session_expired' 
      }} 
      replace 
    />;
  }

  // Se não estiver autenticado, redireciona para a rota especificada
  // Armazena a localização atual para redirecionar de volta após login
  if (!isAuthenticated) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PrivateRoute: Não autenticado, redirecionando para ${redirectPath}`);
    return <Navigate 
      to={redirectPath} 
      state={{ from: location }} 
      replace 
    />;
  }

  // Se estiver autenticado, renderiza as rotas filhas
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] PrivateRoute: Autenticado, renderizando rota protegida ${location.pathname}`);
  return <Outlet />;
};
