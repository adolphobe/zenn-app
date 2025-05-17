
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

/**
 * PrivateRoute - Protege rotas que requerem autenticação
 * Implementa verificação robusta de autenticação e redirecionamento inteligente
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading, currentUser, session } = useAuth();
  const location = useLocation();
  
  // Log detalhado do componente para depuração
  useEffect(() => {
    console.log("[PrivateRoute] Montado:", {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      sessionExists: !!session,
      timestamp: new Date().toISOString()
    });
    
    return () => {
      console.log("[PrivateRoute] Desmontado:", {
        path: location.pathname,
        timestamp: new Date().toISOString()
      });
    };
  }, [location.pathname, isAuthenticated, isLoading, session]);
  
  // Log em cada renderização para depuração
  console.log("[PrivateRoute] Renderizando:", { 
    path: location.pathname,
    isAuthenticated, 
    isLoading,
    sessionExists: !!session,
    currentUser: currentUser ? {
      id: currentUser.id,
      email: currentUser.email,
    } : null
  });

  // Se ainda estiver carregando, mostra indicador de carregamento
  if (isLoading) {
    console.log("[PrivateRoute] Autenticação carregando...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500">Verificando autenticação...</span>
      </div>
    );
  }
  
  // Se não estiver autenticado após carregamento completo, redireciona para login
  if (!isAuthenticated) {
    console.log("[PrivateRoute] Usuário não autenticado, redirecionando para login com state:", { from: location.pathname });
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se chegar aqui, está autenticado e pode acessar a rota
  console.log("[PrivateRoute] Usuário autenticado, permitindo acesso à rota:", location.pathname);
  return <Outlet />;
};
