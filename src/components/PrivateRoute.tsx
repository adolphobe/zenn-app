
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute - Verifica se o usuário está autenticado para acessar rotas protegidas
 * Adiciona logs detalhados para ajudar na depuração
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();
  
  // Adiciona logs detalhados para depuração
  console.log("[PrivateRoute] Verificando autenticação:", { 
    path: location.pathname,
    isAuthenticated, 
    isLoading,
    currentUser: currentUser ? {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name
    } : null,
    timestamp: new Date().toISOString()
  });

  // Se ainda estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    console.log("[PrivateRoute] Autenticação ainda carregando...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500">Verificando autenticação...</span>
      </div>
    );
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    console.log("[PrivateRoute] Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se estiver autenticado, permite acesso à rota
  console.log("[PrivateRoute] Usuário autenticado, permitindo acesso à rota:", location.pathname);
  return <Outlet />;
};
