
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, ListChecks, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarSection } from './SidebarSection';

interface SidebarModeSectionProps {
  sidebarOpen: boolean;
}

const SidebarModeSection: React.FC<SidebarModeSectionProps> = ({ sidebarOpen }) => {
  // Helper to get active class
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center p-2 rounded-md transition-colors",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      isActive ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-700 dark:text-gray-300"
    );

  return (
    <SidebarSection 
      title="Navegação"
      showTitle={sidebarOpen}
    >
      <div className="space-y-1">
        <NavLink 
          to="/dashboard" 
          className={getNavClass}
          title="Dashboard"
        >
          <ListChecks className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/task-history" 
          className={getNavClass}
          title="Histórico"
        >
          <History className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Histórico</span>}
        </NavLink>

        <NavLink 
          to="/task-history-new" 
          className={getNavClass}
          title="Novo Histórico"
        >
          <Clock className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Novo Histórico</span>}
        </NavLink>
        
        <NavLink 
          to="/strategic-review" 
          className={getNavClass}
          title="Análise Estratégica"
        >
          <Calendar className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Análise Estratégica</span>}
        </NavLink>
      </div>
    </SidebarSection>
  );
};

export default SidebarModeSection;
