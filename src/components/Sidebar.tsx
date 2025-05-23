
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarModeSection from './sidebar/SidebarModeSection';
import SidebarFilterSection from './sidebar/SidebarFilterSection';
import SidebarSettingsSection from './sidebar/SidebarSettingsSection';
import SidebarUserProfile from './sidebar/SidebarUserProfile';
import SidebarMobileOverlay from './sidebar/SidebarMobileOverlay';

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

  // Add animation styles to the document head
  useEffect(() => {
    // Create a style element for the animation
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes slideInFromLeft {
        0% {
          transform: translateX(-100%);
          opacity: 0.5;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
                  ${isMobile ? (sidebarOpen ? 'translate-x-0 transition-transform ease-out duration-300' : '-translate-x-full') : ''}`}
        style={isMobile && sidebarOpen ? { animation: 'slideInFromLeft 0.3s ease-out forwards' } : {}}
      >
        <SidebarHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-3 flex-1">
          <SidebarModeSection sidebarOpen={sidebarOpen} />
          <SidebarFilterSection sidebarOpen={sidebarOpen} />
          <SidebarSettingsSection sidebarOpen={sidebarOpen} />
        </div>
        
        <SidebarUserProfile sidebarOpen={sidebarOpen} />
      </div>
    </>
  );
};

export default Sidebar;
