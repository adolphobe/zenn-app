
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../context/AppContext';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import UserMenu from '@/components/UserMenu';

// ActoApp agora funciona como layout para rotas aninhadas
const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { viewMode } = state;
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Determine se estamos na rota do dashboard para ajuste de layout
  const isDashboardRoute = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  // Verifica autenticação e redireciona se necessário
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location } });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Close sidebar on route change if on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile, location.pathname, sidebarOpen, toggleSidebar]);

  // Determine if we should use a narrower max-width for task cards (only in power and chronological mode)
  const isTaskCardView = isDashboardRoute && (viewMode === 'power' || viewMode === 'chronological');
  
  // Se ainda estiver verificando a autenticação, mostra um indicador de carregamento
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Mobile Menu Toggle Button - Visible only when sidebar is closed on mobile */}
      {isMobile && !sidebarOpen && (
        <button 
          onClick={openSidebar}
          className="fixed bottom-4 right-4 z-40 p-2 rounded-md bg-gray-500/50 text-white shadow-md hover:bg-gray-600/70 transition-colors"
          aria-label="Open menu"
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
          "flex justify-center" // Add this to center the content horizontally
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
