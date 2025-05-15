

import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarModeSection from './sidebar/SidebarModeSection';
import SidebarFilterSection from './sidebar/SidebarFilterSection';
import SidebarSettingsSection from './sidebar/SidebarSettingsSection';
import SidebarUserProfile from './sidebar/SidebarUserProfile';
import SidebarMobileOverlay from './sidebar/SidebarMobileOverlay';
import HistoryNavItem from './sidebar/HistoryNavItem';

const Sidebar: React.FC = () => {
  const { 
    state: { sidebarOpen }, 
    toggleSidebar
  } = useAppContext();
  
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile when it's initially loaded
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile]);

  if (!sidebarOpen && isMobile) {
    return null; // Don't render sidebar at all on mobile when closed
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && <SidebarMobileOverlay isActive={sidebarOpen} onClose={toggleSidebar} />}
      
      {/* Sidebar container */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
                  transition-all duration-300 z-30 card-shadow flex flex-col 
                  ${sidebarOpen ? 'w-64' : 'w-20'} 
                  ${isMobile ? (sidebarOpen ? 'translate-x-0' : 'translate-x-full') : ''}`}
      >
        <SidebarHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-3 flex-1">
          {/* Changed the section title from "Modos" to "Menu" by passing a custom title prop */}
          <SidebarModeSection sidebarOpen={sidebarOpen} title="Menu" />
          
          {/* Add History Nav Item */}
          <div className="my-3">
            <HistoryNavItem />
          </div>
          
          <SidebarFilterSection sidebarOpen={sidebarOpen} />
          <SidebarSettingsSection sidebarOpen={sidebarOpen} />
        </div>
        
        <SidebarUserProfile sidebarOpen={sidebarOpen} />
      </div>
    </>
  );
};

export default Sidebar;
