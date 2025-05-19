
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, History, Power, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarSection from './SidebarSection';
import { useAppContext } from '@/context/AppContext';

interface SidebarModeSectionProps {
  sidebarOpen: boolean;
}

const SidebarModeSection: React.FC<SidebarModeSectionProps> = ({ sidebarOpen }) => {
  const { state: { viewMode }, toggleViewMode } = useAppContext();
  
  // Helper to get active class
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center p-2 rounded-md transition-colors",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      isActive ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-700 dark:text-gray-300"
    );

  // Helper for mode button active state
  const getModeClass = (mode: string) =>
    cn(
      "flex items-center p-2 rounded-md transition-colors cursor-pointer",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      viewMode === mode 
        ? "bg-gray-100 dark:bg-gray-800 text-primary" 
        : "text-gray-700 dark:text-gray-300"
    );

  return (
    <SidebarSection 
      title="Navegação"
      sidebarOpen={sidebarOpen}
    >
      <div className="space-y-1">
        {/* Removed Dashboard item as requested */}
        
        {/* Modo de Potência */}
        <div 
          className={getModeClass('power')}
          onClick={toggleViewMode}
          title="Modo de Potência"
        >
          <Power className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Modo de Potência</span>}
        </div>
        
        {/* Modo Cronológico */}
        <div 
          className={getModeClass('chronological')}
          onClick={toggleViewMode}
          title="Modo Cronológico"
        >
          <Clock className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Modo Cronológico</span>}
        </div>
        
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
