
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import diretamente do arquivo
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PrivateRoute - Versão simplificada que não bloqueia acesso
 * Mantém logs detalhados para diagnóstico
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  
  // Create an instance identifier for better tracking in logs
  const instanceId = Math.random().toString(36).substring(2, 7);

  // Component mount tracking with timestamp
  const timestamp = new Date().toISOString();
  console.log(`[PrivateRoute:${instanceId}] MONTADO em ${location.pathname} - ${timestamp}`);
  
  // Log authentication information without session details to avoid serialization issues
  console.log(`[PrivateRoute:${instanceId}] Estado de autenticação: ${isAuthenticated ? 'Autenticado' : 'Não-autenticado'}, Carregando: ${isLoading}, Rota: ${location.pathname}`);
  
  // Mostrar informações de autenticação sem bloquear acesso
  console.log(`[PrivateRoute:${instanceId}] Renderizando conteúdo em ${location.pathname} independentemente do status de autenticação`);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      {/* Informações de diagnóstico para auxílio no desenvolvimento */}
      <div className="fixed top-0 right-0 z-50 p-2 bg-blue-100 border border-blue-300 text-blue-800 text-xs rounded m-2 opacity-80 shadow">
        <p><strong>Auth Status:</strong> {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
        <p><strong>User:</strong> {currentUser?.email || 'None'}</p>
        <p><strong>Path:</strong> {location.pathname}</p>
        <p><strong>Instance:</strong> {instanceId}</p>
        <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
      </div>

      <Sidebar />
      
      {/* Mobile menu toggle button */}
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
