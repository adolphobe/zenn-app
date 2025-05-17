
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Definir authChecked como verdadeiro após a verificação inicial
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);
  
  // Se ainda estiver carregando, mostra um indicador de carregamento
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
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
  
  // Caso contrário, redireciona para login com o caminho atual como estado
  return <Navigate to="/login" state={{ from: location }} replace />;
};
