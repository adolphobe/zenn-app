
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface SidebarHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  const { state: { darkMode } } = useAppContext();
  
  const logoSrc = darkMode 
    ? "https://cdn.shopify.com/s/files/1/0629/1993/4061/files/logo_white.png?v=1747460873"
    : "https://cdn.shopify.com/s/files/1/0629/1993/4061/files/loogzenn.png?v=1747447750";

  return (
    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      {sidebarOpen ? (
        <div className="flex items-center">
          <img 
            src={logoSrc} 
            alt="ACTO Logo" 
            className="h-6 max-w-[80px] object-contain" 
          />
        </div>
      ) : (
        <div className="sr-only">ACTO</div>
      )}
      <button 
        onClick={toggleSidebar} 
        className="p-2 rounded-lg text-[#8eceea] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default SidebarHeader;
