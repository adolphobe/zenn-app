
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente simplificado que protege rotas, permitindo acesso apenas a usuários autenticados
 * ou deixando passar qualquer requisição se estivermos em modo de desenvolvimento
 */
export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  
  // Em desenvolvimento, permitir acesso independentemente da autenticação
  const isDevelopment = import.meta.env.DEV;
  
  // Se estiver autenticado ou em ambiente de desenvolvimento, permite o acesso
  if (isAuthenticated || isDevelopment) {
    return <Outlet />;
  }
  
  // Caso contrário, redireciona para login
  return <Navigate to="/login" replace />;
};
