
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../context/AppContext';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// ActoApp funciona como um layout para rotas aninhadas
const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { viewMode } = state;
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Debug
  useEffect(() => {
    console.log('ActoApp render:', { isAuthenticated, isLoading, path: location.pathname });
  }, [isAuthenticated, isLoading, location]);
  
  // Determinar se estamos na rota dashboard para ajuste de layout
  const isDashboardRoute = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  // Mostra indicador de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Não renderiza nada se não estiver autenticado
  // Isto é um segundo nível de proteção após PrivateRoute
  if (isAuthenticated !== true) {
    console.log('Não autenticado em ActoApp, navegando para página de login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Determinar se devemos usar uma largura máxima mais estreita para cartões de tarefas (apenas no modo power e chronological)
  const isTaskCardView = isDashboardRoute && (viewMode === 'power' || viewMode === 'chronological');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Botão de alternância do menu móvel - Visível apenas quando a barra lateral está fechada no celular */}
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
          "flex justify-center" // Adicionar isso para centralizar o conteúdo horizontalmente
        )}
      >
        <div className={cn(
          "w-full", 
          isTaskCardView ? "max-w-3xl" : "max-w-6xl"
        )}> 
          <Outlet /> {/* Renderiza a rota aninhada atual */}
        </div>
      </main>
    </div>
  );
};

export default ActoApp;
