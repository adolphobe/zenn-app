
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { useAppContext } from '../context/AppContext';
import { useSidebar } from '@/context/hooks';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { viewMode } = state;
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser(); // Get current user from context
  const isDashboardRoute = location.pathname === '/dashboard';

  // Authentication check and redirect logic
  useEffect(() => {
    console.log("ActoApp: Checking authentication state...");
    console.log("ActoApp: isLoading:", isLoading);
    console.log("ActoApp: currentUser:", currentUser ? 'exists' : 'null');
    console.log("ActoApp: current path:", location.pathname);
    
    // Only check after we know if user is logged in or not
    if (!isLoading) {
      if (!currentUser && 
          location.pathname !== '/' && 
          location.pathname !== '/login') {
        // User is not authenticated and trying to access protected route
        console.log("ActoApp: User not authenticated, redirecting to login");
        navigate('/login');
      } else if (currentUser && 
                (location.pathname === '/login' || location.pathname === '/')) {
        // User is authenticated and trying to access public route
        console.log("ActoApp: User already authenticated, redirecting to dashboard");
        navigate('/dashboard');
      }
    }
  }, [currentUser, isLoading, navigate, location.pathname]);

  // Close sidebar on route change if on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile, location.pathname, sidebarOpen, toggleSidebar]);

  // If still loading, show loading spinner
  if (isLoading) {
    console.log("ActoApp: Showing loading spinner");
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // If user is not authenticated and not on public route, redirect is handled in useEffect
  if (!currentUser && location.pathname !== '/' && location.pathname !== '/login') {
    console.log("ActoApp: No user but rendering anyway (redirect will happen in useEffect)");
    return null;
  }

  // Determine if we should use a narrower max-width for task cards (only in power and chronological mode)
  const isTaskCardView = isDashboardRoute && (viewMode === 'power' || viewMode === 'chronological');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Mobile Menu Toggle Button - Visible only when sidebar is closed on mobile */}
      {isMobile && !sidebarOpen && (
        <button 
        onClick={openSidebar}
        className="fixed bottom-4 right-4 z-40 p-2 rounded-md bg-gray-500/50 text-white shadow-md hover:bg-gray-600/70 transition-colors"
        aria-label="Open menu"
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
          "flex justify-center" // Add this to center the content horizontally
        )}
      >
        <div className={cn(
          "w-full", 
          isTaskCardView ? "max-w-3xl" : "max-w-6xl"
        )}> 
          {isDashboardRoute ? (
            <Dashboard />
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default ActoApp;
