import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
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

  // User is authenticated, render the protected layout with outlet
  return (
    <>
      {isDashboardRoute && <LoadingOverlay show={showLoading} />}
      <Outlet />
    </>
  );
};
