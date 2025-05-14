
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <h1 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 ${!sidebarOpen && 'sr-only'}`}>ACTO</h1>
      <button 
        onClick={toggleSidebar} 
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default SidebarHeader;
