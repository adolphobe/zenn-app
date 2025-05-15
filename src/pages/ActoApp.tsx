
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/context/hooks';

const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { viewMode } = state;
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = location.pathname === '/' || location.pathname === '/dashboard';

  // Check if user is logged in (this is just a mock check)
  const isLoggedIn = localStorage.getItem('acto_is_logged_in') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Close sidebar on route change if on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile, location.pathname]);

  // Determine if we should use a narrower max-width for task cards (only in power and chronological mode)
  const isTaskCardView = isDashboardRoute && (viewMode === 'power' || viewMode === 'chronological');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      
      {/* Mobile Menu Toggle Button - Visible only when sidebar is closed on mobile */}
      {isMobile && !sidebarOpen && (
        <button 
          onClick={openSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-600 text-white shadow-lg hover:bg-blue-700"
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
