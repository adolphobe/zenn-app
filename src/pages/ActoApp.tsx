
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import { useSidebar } from '@/context/hooks';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const ActoApp: React.FC = () => {
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  const location = useLocation();
  const currentIsMobile = useIsMobile();
  
  // Determine if we're on a mobile-specific route
  const isMobileRoute = location.pathname.startsWith('/mobile/');
  
  // Preload mobile components as soon as ActoApp renders
  useEffect(() => {
    // If on mobile device, preload mobile components immediately
    if (currentIsMobile) {
      // Preload both pages immediately to avoid white screen transitions
      const preloadPower = import('@/pages/mobile/MobilePowerPage');
      const preloadChrono = import('@/pages/mobile/MobileChronologicalPage');
      
      // Also preload other commonly used pages
      const preloadHistory = import('@/pages/mobile/MobileTaskHistoryPage');
    }
    
    // If on desktop dashboard, also preload mobile components as they might be needed
    // if the user resizes their window
    if (location.pathname === '/dashboard') {
      setTimeout(() => {
        const preloadPower = import('@/pages/mobile/MobilePowerPage');
        const preloadChrono = import('@/pages/mobile/MobileChronologicalPage');
      }, 500);
    }
  }, [currentIsMobile, location.pathname]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      {/* Desktop sidebar - only show on non-mobile routes */}
      {!currentIsMobile && <Sidebar />}
      
      <main 
        className={cn(
          "transition-all duration-300 p-4 md:p-6 lg:p-8 flex-grow pb-[70px] md:pb-16 md:pb-8",
          sidebarOpen 
            ? currentIsMobile ? "ml-0" : "md:ml-64" 
            : currentIsMobile ? "ml-0" : "md:ml-20",
          "flex justify-center"
        )}
      >
        <div className="w-full max-w-6xl"> 
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Navigation - only show on mobile routes or devices */}
      {currentIsMobile && <MobileBottomNav />}
    </div>
  );
};

export default ActoApp;
