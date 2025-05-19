
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * PrivateRoute - Protects routes that require authentication
 * Logs and redirects when not authenticated
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const [authChecked, setAuthChecked] = useState(false);
  const [localAuthCheck, setLocalAuthCheck] = useState<boolean | null>(null);

  // Check if a logout is in progress to prevent login/logout loops
  const logoutInProgress = localStorage.getItem('logout_in_progress') === 'true';

  // Additional check for authentication using localStorage directly
  useEffect(() => {
    const checkLocalAuth = async () => {
      try {
        // Se um logout estiver em andamento, não tente verificar autenticação
        if (logoutInProgress) {
          setLocalAuthCheck(false);
          return;
        }
        
        // Check for token in localStorage
        const hasToken = !!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
        
        // If no token in localStorage, we're definitely not authenticated
        if (!hasToken) {
          setLocalAuthCheck(false);
          return;
        }
        
        // Double-check with Supabase API
        const { data } = await supabase.auth.getSession();
        setLocalAuthCheck(!!data.session);
      } catch (err) {
        console.error("[PrivateRoute] Erro ao verificar token local:", err);
        setLocalAuthCheck(false);
      }
    };

    checkLocalAuth();
  }, [logoutInProgress]);

  // Use effect to ensure we've completed at least one auth check
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);

  console.log(`[PrivateRoute] Verificando autenticação em ${location.pathname}, isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}, authChecked: ${authChecked}, logoutInProgress: ${logoutInProgress}, localAuthCheck: ${localAuthCheck}`);

  // Show loading state while checking authentication
  if (isLoading || !authChecked || localAuthCheck === null) {
    console.log("[PrivateRoute] Ainda carregando estado de autenticação...");
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Log auth status and redirect if not authenticated or logout in progress
  // Use both checks - from context AND from local storage
  const actuallyAuthenticated = isAuthenticated && !logoutInProgress && localAuthCheck === true;
  
  if (!actuallyAuthenticated) {
    const reason = logoutInProgress ? "logout em andamento" : "não autenticado";
    console.error(`[PrivateRoute] ERRO DE AUTENTICAÇÃO: Usuário ${reason} em ${location.pathname}`);
    console.error("[PrivateRoute] DETALHES TÉCNICOS: Redirecionando para /login");
    console.error("[PrivateRoute] ESTADO DE AUTENTICAÇÃO:", { isAuthenticated, isLoading, localAuthCheck, logoutInProgress, path: location.pathname });
    
    // Clear any lingering session data if we detect a logout in progress
    if (logoutInProgress) {
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      // Return a redirect to login with current location stored for later redirect back
      // Add a timestamp to avoid caching issues
      return <Navigate to={`/login?loggedOut=true&_=${new Date().getTime()}`} state={{ 
        from: location,
        loggedOut: true,
        timestamp: new Date().getTime(),
        forceClear: true
      }} replace />;
    }
    
    // Return a redirect to login with current location stored for later redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected layout with sidebar
  console.log(`[PrivateRoute] Usuário está autenticado, renderizando conteúdo protegido em ${location.pathname}`);
  
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
