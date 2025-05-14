
import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ActoApp: React.FC = () => {
  const { state, toggleSidebar } = useAppContext();
  const { sidebarOpen } = state;
  const isMobile = useIsMobile();

  // Close sidebar on route change if on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default ActoApp;
