
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import directly from file
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PrivateRoute - Protects routes that require authentication
 * Enhanced with detailed logging and improved authentication handling
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading, currentUser, session } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  
  // Create an instance identifier for better tracking in logs
  const instanceId = Math.random().toString(36).substring(2, 7);

  // Component mount tracking with timestamp
  const timestamp = new Date().toISOString();
  console.log(`[PrivateRoute:${instanceId}] MONTADO em ${location.pathname} - ${timestamp}`);
  
  // Log detailed authentication information 
  console.log(`[PrivateRoute:${instanceId}] Estado de autenticação: ${isAuthenticated ? 'Autenticado' : 'Não-autenticado'}, Carregando: ${isLoading}, Rota: ${location.pathname}`);
  
  if (currentUser) {
    console.log(`[PrivateRoute:${instanceId}] Usuário encontrado: ${currentUser.email}`);
  } else {
    console.log(`[PrivateRoute:${instanceId}] Nenhum usuário encontrado no contexto`);
  }

  // Show loading state while checking authentication
  if (isLoading) {
    console.log(`[PrivateRoute:${instanceId}] Aguardando carregamento de autenticação...`);
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <div className="ml-4">Verificando autenticação... {timestamp}</div>
    </div>;
  }

  // Log authentication result but don't redirect
  if (!isAuthenticated) {
    console.error(`[PrivateRoute:${instanceId}] ERRO DE AUTENTICAÇÃO: Usuário não autenticado em ${location.pathname}`);
    
    // Return authentication warning instead of redirecting
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Acesso Restrito</h1>
          <p className="mb-4 text-gray-700">
            Você não está autenticado e está tentando acessar uma página protegida.
          </p>
          <p className="mb-4 text-gray-700">
            Em uma versão normal, você seria redirecionado para a página de login, 
            mas o redirecionamento automático foi desativado.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Path: {location.pathname} | Auth Status: {isAuthenticated ? "Autenticado" : "Não Autenticado"}
          </p>
          
          <div className="mt-6">
            <a 
              href="/login" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Ir para Login manualmente
            </a>
          </div>
          
          {/* Debug information */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p className="font-semibold">Informações técnicas:</p>
            <p>Instance ID: {instanceId}</p>
            <p>Timestamp: {timestamp}</p>
            <p>HasToken: {!!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token') ? 'Sim' : 'Não'}</p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected layout with sidebar
  console.log(`[PrivateRoute:${instanceId}] Usuário autenticado, renderizando conteúdo em ${location.pathname}`);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
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
