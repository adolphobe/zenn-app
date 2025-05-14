
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

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
      {isDashboardRoute ? (
        <Dashboard />
      ) : (
        <main className={`ml-${sidebarOpen ? '64' : '20'} transition-all duration-300 p-4 md:p-6 lg:p-8`}>
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default ActoApp;
