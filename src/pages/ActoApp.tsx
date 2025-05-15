
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { sidebarOpen } = state;
  const isMobile = useIsMobile();
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/' || location.pathname === '/dashboard';

  // Close sidebar on route change if on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main 
        className={cn(
          "transition-all duration-300 p-4 md:p-6 lg:p-8",
          sidebarOpen 
            ? isMobile ? "ml-0" : "md:ml-64" 
            : isMobile ? "ml-0" : "md:ml-20"
        )}
      >
        {isDashboardRoute ? (
          <Dashboard />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default ActoApp;
