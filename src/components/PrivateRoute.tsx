import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { LoadingOverlay } from './ui/loading-overlay';
import { INITIAL_LOAD_COMPLETE_KEY, INITIAL_LOAD_DELAY, INTERNAL_NAVIGATION_DELAY } from '@/utils/authConstants';

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
  
  // Check if this is the initial load of the application
  const isInitialLoad = useMemo(() => 
    localStorage.getItem(INITIAL_LOAD_COMPLETE_KEY) !== 'true',
  []);
  
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

  // Set initial loading state based on route and whether this is initial load
  useEffect(() => {
    if (isDashboardRoute && isAuthenticated) {
      setShowLoading(true);
      
      // Determine appropriate loading time based on whether this is initial load
      const loadingDelay = isInitialLoad ? INITIAL_LOAD_DELAY : INTERNAL_NAVIGATION_DELAY;
      
      // Auto-hide loading after content is likely rendered
      const timer = setTimeout(() => {
        setShowLoading(false);
        
        // Mark initial load as complete after first dashboard load
        if (isInitialLoad) {
          localStorage.setItem(INITIAL_LOAD_COMPLETE_KEY, 'true');
        }
      }, loadingDelay);
      
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isDashboardRoute, isAuthenticated, isInitialLoad]);

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

  // User is authenticated, render the protected layout with outlet
  return (
    <>
      {isDashboardRoute && <LoadingOverlay show={showLoading} />}
      <Outlet />
    </>
  );
};
