
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

/**
 * PrivateRoute - Protege rotas que requerem autenticação
 * Redireciona para login se o usuário não estiver autenticado
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log para debug
  useEffect(() => {
    console.log('PrivateRoute render:', { 
      isAuthenticated, 
      isLoading, 
      path: location.pathname 
    });
  }, [isAuthenticated, isLoading, location]);
  
  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Verificação simplificada - se não autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para login de:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Se autenticado, renderiza normalmente
  console.log('Usuário autenticado, renderizando rota protegida:', location.pathname);
  return <Outlet />;
};
