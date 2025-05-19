
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { logInfo } from '@/utils/logUtils';

/**
 * PrivateRoute - Protege rotas que requerem autenticação
 * Versão simplificada para evitar re-renderizações desnecessárias
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Verificação otimizada para evitar loops de renderização
  const logoutInProgress = useMemo(() => 
    localStorage.getItem('logout_in_progress') === 'true',
  []);
  
  // Efetua verificação de autenticação uma única vez
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
      logInfo('PrivateRoute', `Autenticação verificada: ${isAuthenticated ? 'autenticado' : 'não autenticado'}`);
    }
  }, [isLoading]);

  // Mostra estado de carregamento enquanto verifica autenticação
  if (isLoading || !authChecked) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Verificação de autenticação simplificada
  if (!isAuthenticated || logoutInProgress) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário autenticado, renderiza o layout protegido com sidebar
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Botão de menu móvel */}
      {isMobile && !sidebarOpen && (
        <button 
          onClick={openSidebar}
          className="fixed bottom-4 right-4 z-40 p-2 rounded-md bg-gray-500/50 text-white shadow-md hover:bg-gray-600/70 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}
      
      <main 
        className={cn(
          "transition-all duration-300 p-4 md:p-6 lg:p-8 flex-grow",
          sidebarOpen 
            ? isMobile ? "ml-0" : "md:ml-64" 
            : isMobile ? "ml-0" : "md:ml-20",
          "flex justify-center"
        )}
      >
        <div className="w-full max-w-6xl"> 
          <Outlet />
        </div>
      </main>
    </div>
  );
};
