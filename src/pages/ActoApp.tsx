
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../context/AppContext';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

// ActoApp funciona como um layout para rotas aninhadas
const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { viewMode } = state;
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const location = useLocation();
  
  // Determinar se estamos na rota dashboard para ajuste de layout
  const isDashboardRoute = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  
  // Determinar se devemos usar uma largura máxima mais estreita para cartões de tarefas
  const isTaskCardView = isDashboardRoute && (viewMode === 'power' || viewMode === 'chronological');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Botão de alternância do menu móvel */}
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
        <div className={cn(
          "w-full", 
          isTaskCardView ? "max-w-3xl" : "max-w-6xl"
        )}> 
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ActoApp;
