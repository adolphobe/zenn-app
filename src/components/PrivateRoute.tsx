
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import Sidebar from './Sidebar';
import MobileBottomNav from './mobile/MobileBottomNav';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { LoadingOverlay } from './ui/loading-overlay';

/**
 * PrivateRoute - Protects routes that require authentication
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const [authChecked, setAuthChecked] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  // Check if the current route is the dashboard
  const isDashboardRoute = location.pathname === '/dashboard';
  
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

  // Set initial loading state based on route
  useEffect(() => {
    if (isDashboardRoute && isAuthenticated) {
      setShowLoading(true);
      
      // Auto-hide loading after content is likely rendered
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1800);
      
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isDashboardRoute, isAuthenticated]);

  // Show loading overlay while checking authentication
  if (isLoading || !authChecked) {
    // Don't show any loading UI during logout
    if (logoutInProgress) return null;
    
    if (isDashboardRoute) {
      return <LoadingOverlay show={true} />;
    }
    
    // Otherwise, hide any loading UI to avoid flashing
    return null;
  }

  // Simplified authentication check
  const actuallyAuthenticated = isAuthenticated && !logoutInProgress;
  
  if (!actuallyAuthenticated) {
    // Return a redirect to login with current location stored for later redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected layout with sidebar
  return (
    <>
      {isDashboardRoute && <LoadingOverlay show={showLoading} />}
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
        {/* Desktop sidebar */}
        {!isMobile && <Sidebar />}
        
        {/* Mobile menu toggle button - only when sidebar is closed */}
        {isMobile && !sidebarOpen && (
          <button 
            onClick={openSidebar}
            className="fixed bottom-20 right-4 z-40 p-2 rounded-md bg-gray-500/50 text-white shadow-md hover:bg-gray-600/70 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
        )}
        
        <main 
          className={cn(
            "transition-all duration-300 p-4 md:p-6 lg:p-8 flex-grow pb-16 md:pb-8",
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
        
        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileBottomNav />}
      </div>
    </>
  );
};
