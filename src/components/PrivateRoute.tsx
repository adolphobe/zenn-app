
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Em desenvolvimento, permitir acesso independentemente da autenticação
  const isDevelopment = import.meta.env.DEV;
  
  // Se estiver autenticado ou em ambiente de desenvolvimento, permite o acesso
  if (isAuthenticated || isDevelopment) {
    return <Outlet />;
  }
  
  // Caso contrário, redireciona para login
  return <Navigate to="/login" replace />;
};
