
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import { useSidebar } from '@/context/hooks';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const ActoApp: React.FC = () => {
  const { isOpen: sidebarOpen, open: openSidebar, isMobile } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}
      
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
  );
};

export default ActoApp;
