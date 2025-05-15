import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      {sidebarOpen ? (
        <div className="flex items-center">
          <img 
            src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-8.jpg?v=1747284016" 
            alt="ACTO Logo" 
            className="h-8 w-auto" 
          />
        </div>
      ) : (
        <div className="sr-only">ACTO</div>
      )}
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