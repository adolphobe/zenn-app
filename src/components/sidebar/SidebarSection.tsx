
import React from 'react';

interface SidebarSectionProps {
  title: string;
  sidebarOpen: boolean;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, sidebarOpen, children }) => {
  return (
    <div className="mb-6">
      <p className={`text-xs text-gray-500 px-4 py-2 ${!sidebarOpen && 'sr-only'}`}>
        {title}
      </p>
      {children}
    </div>
  );
};

export default SidebarSection;
