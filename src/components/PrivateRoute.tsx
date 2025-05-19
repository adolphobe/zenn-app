
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { logWarn, logInfo } from '@/utils/logUtils';

/**
 * PrivateRoute - Protects routes that require authentication
 * Fixed to handle URL duplication issues
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check for logout in progress to prevent login/logout loops
  const logoutInProgress = useMemo(() => 
    localStorage.getItem('logout_in_progress') === 'true',
  []);
  
  // Clean up duplicated routes like `/task-history#/task-history`
  useEffect(() => {
    const currentPath = location.pathname;
    const currentHash = location.hash;
    
    // Only run this logic if we have a hash that might be causing issues
    if (currentHash && currentHash.length > 1) {
      // Extract the path from the hash
      const hashPath = currentHash.substring(1); // Remove the leading #
      
      // Check if the hash path repeats the main path
      if (currentPath === hashPath || 
          (currentPath.endsWith('/') && hashPath === currentPath.slice(0, -1)) ||
          (hashPath.endsWith('/') && currentPath === hashPath.slice(0, -1))) {
        
        logWarn('ROUTE', `Detectado caminho duplicado: ${currentPath} no hash ${currentHash}`, 
                { path: currentPath });
        
        // Navigate to the correct path without duplication
        navigate(currentPath, { replace: true });
        return;
      }
      
      // Also handle case where path is already in the hash
      const pathInHash = currentPath.includes('#') && currentPath.split('#')[1] === hashPath;
      if (pathInHash) {
        const cleanPath = currentPath.split('#')[0];
        logWarn('ROUTE', `Corrigindo rota com caminho duplicado no hash`, 
                { from: currentPath, to: cleanPath });
        navigate(cleanPath, { replace: true });
        return;
      }
    }
    
    // Log current location for debugging
    logInfo('PrivateRoute', `Rota atual: ${currentPath}${currentHash}`);
  }, [location, navigate]);

  // Use effect to ensure we've completed at least one auth check
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);

  // Show loading state while checking authentication
  if (isLoading || !authChecked) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Simplified authentication check
  const actuallyAuthenticated = isAuthenticated && !logoutInProgress;
  
  if (!actuallyAuthenticated) {
    logInfo(`PrivateRoute`, `Usuário não autenticado, redirecionando de ${location.pathname}`);
    
    // Return a redirect to login with current location stored for later redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected layout with sidebar
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
