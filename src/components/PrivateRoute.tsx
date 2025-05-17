
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * PrivateRoute - Protege rotas que requerem autenticação
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log simplificado para depuração
  console.log("[PrivateRoute] Renderizando:", { 
    path: location.pathname,
    isAuthenticated, 
    isLoading
  });

  // Se estiver carregando, mostra indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500">Verificando autenticação...</span>
      </div>
    );
  }
  
  // Se não estiver autenticado após carregamento completo, redireciona para login
  if (!isAuthenticated) {
    console.log("[PrivateRoute] Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se chegar aqui, está autenticado e pode acessar a rota
  console.log("[PrivateRoute] Usuário autenticado, permitindo acesso à rota:", location.pathname);
  return <Outlet />;
};
