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
            className="h-6 max-w-[80px] object-contain" 
          />
        </div>
      ) : (
        <div className="sr-only">ACTO</div>
      )}
     
    </div>
  );
};

export default SidebarHeader;