import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { logInfo } from '@/utils/logUtils';
import { LoadingOverlay } from './ui/loading-overlay';

/**
 * PrivateRoute - Protects routes that require authentication
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check for logout in progress to prevent login/logout loops
  const logoutInProgress = useMemo(() => 
    localStorage.getItem('logout_in_progress') === 'true',
  []);
  
  // Use effect to ensure we've completed at least one auth check
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);

  // Check if login is successful and we should show the loading overlay
  const loginSuccess = localStorage.getItem('login_success') === 'true';

  // Show loading overlay while checking authentication
  if (isLoading || !authChecked) {
    if (loginSuccess) {
      // Show the consistent loading overlay instead of the simple spinner
      return <LoadingOverlay show={true} />;
    }
    
    // Don't show any loading UI during logout
    if (logoutInProgress) return null;
    
    // Otherwise, hide any loading UI to avoid flashing
    return null;
  }

  // Simplified authentication check
  const actuallyAuthenticated = isAuthenticated && !logoutInProgress;
  
  if (!actuallyAuthenticated) {
    // Return a redirect to login with current location stored for later redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Clear the login_success flag once authenticated route is rendered
  if (loginSuccess) {
    localStorage.removeItem('login_success');
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
