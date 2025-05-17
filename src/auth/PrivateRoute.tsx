
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface PrivateRouteProps {
  redirectPath?: string;
}

/**
 * Componente que protege rotas, permitindo acesso apenas a usuários autenticados
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  redirectPath = '/login'  
}) => {
  const { isAuthenticated, isLoading, authError } = useAuth();
  const location = useLocation();

  // Log de depuração para rastrear o estado de autenticação
  useEffect(() => {
    console.log(`PrivateRoute: Verificando autenticação para rota "${location.pathname}"`, {
      isAuthenticated,
      isLoading,
      authError
    });
  }, [isAuthenticated, isLoading, authError, location.pathname]);

  // Mostra um loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se a sessão expirou, redireciona para login com mensagem específica
  if (authError === 'session_expired') {
    console.log("PrivateRoute: Sessão expirada, redirecionando para", redirectPath);
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
    console.log("PrivateRoute: Não autenticado, redirecionando para", redirectPath);
    return <Navigate 
      to={redirectPath} 
      state={{ from: location }} 
      replace 
    />;
  }

  // Se estiver autenticado, renderiza as rotas filhas
  console.log("PrivateRoute: Autenticado, renderizando rota protegida");
  return <Outlet />;
};
