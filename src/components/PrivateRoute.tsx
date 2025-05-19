
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logWarn, logInfo, logError } from '@/utils/logUtils';

/**
 * PrivateRoute - Protects routes that require authentication
 * Improved to handle URL duplication issues
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const [authChecked, setAuthChecked] = useState(false);
  const [localAuthCheck, setLocalAuthCheck] = useState<boolean | null>(null);

  // Check for logout in progress to prevent login/logout loops
  const logoutInProgress = localStorage.getItem('logout_in_progress') === 'true';
  
  // Check for duplicated routes like `/task-history#/task-history`
  useEffect(() => {
    const currentPath = location.pathname;
    const currentHash = location.hash;
    const currentUrl = window.location.href;
    
    // Detect duplicated path patterns and fix automatically
    if (currentUrl.includes(`${currentPath}#${currentPath}`)) {
      logWarn('ROUTE', `Detected and fixing duplicated path: ${currentUrl}`, { path: currentPath });
      
      // Extract the correct path 
      const correctPath = currentHash.substring(1); // Remove the # character
      
      // Use navigate to fix the URL (without adding an entry to history)
      setTimeout(() => {
        navigate(correctPath, { replace: true });
      }, 0);
    }
    
    // Special handling for task-history route (common problem area)
    if (currentPath === "/task-history" || currentHash === "#/task-history") {
      logInfo("ROUTE", "Accessing task history page", { path: currentPath, hash: currentHash });
    }
  }, [location, navigate]);

  // Additional check for authentication using localStorage directly
  useEffect(() => {
    const checkLocalAuth = async () => {
      try {
        // Don't check authentication if logout in progress
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
        logError("PrivateRoute", "Erro ao verificar token local:", err);
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

  // Show loading state while checking authentication
  if (isLoading || !authChecked || localAuthCheck === null) {
    logInfo("PrivateRoute", "Ainda carregando estado de autenticação...");
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Use both checks - from context AND from local storage
  const actuallyAuthenticated = isAuthenticated && !logoutInProgress && localAuthCheck === true;
  
  if (!actuallyAuthenticated) {
    const reason = logoutInProgress ? "logout em andamento" : "não autenticado";
    logError(`PrivateRoute`, `ERRO DE AUTENTICAÇÃO: Usuário ${reason} em ${location.pathname}`);
    
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
  logInfo(`PrivateRoute`, `Usuário está autenticado, renderizando conteúdo protegido em ${location.pathname}`);
  
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
