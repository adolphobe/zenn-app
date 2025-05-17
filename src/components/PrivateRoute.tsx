
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute - Protege rotas que requerem autenticação
 * Redireciona para login se o usuário não estiver autenticado
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Debug log para rastreamento
  console.log('PrivateRoute check:', { isAuthenticated, isLoading, path: location.pathname });
  
  // Enquanto estiver carregando, mostrar o indicador
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-3 text-blue-500">Verificando autenticação...</div>
      </div>
    );
  }
  
  // Quando terminar de carregar, verificar autenticação
  if (!isAuthenticated) {
    // Guarda o caminho atual para redirecionar após login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Se autenticado, renderiza normalmente
  return <Outlet />;
};
