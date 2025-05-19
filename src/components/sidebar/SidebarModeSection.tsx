
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Clock, History, Power, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarSection from './SidebarSection';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

interface SidebarModeSectionProps {
  sidebarOpen: boolean;
}

const SidebarModeSection: React.FC<SidebarModeSectionProps> = ({ sidebarOpen }) => {
  const { state: { viewMode }, toggleViewMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
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
      viewMode === mode && !location.pathname.includes('task-history') 
        ? "bg-gray-100 dark:bg-gray-800 text-primary" 
        : "text-gray-700 dark:text-gray-300"
    );

  // Handler for mode switching
  const handleModeClick = (mode: string) => {
    if (location.pathname.includes('task-history')) {
      // Navigate to dashboard with the selected mode
      navigate('/dashboard');
      
      // Only toggle view mode if we're switching to a different mode
      if (viewMode !== mode) {
        toggleViewMode();
      }
    } else {
      // Standard behavior when not on a history page
      if (viewMode !== mode) {
        toggleViewMode();
      }
    }
  };

  return (
    <SidebarSection 
      title="Navegação"
      sidebarOpen={sidebarOpen}
    >
      <div className="space-y-1">
        {/* Modo de Potência */}
        <div 
          className={getModeClass('power')}
          onClick={() => handleModeClick('power')}
          title="Modo de Potência"
        >
          <Power className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Modo de Potência</span>}
        </div>
        
        {/* Modo Cronológico */}
        <div 
          className={getModeClass('chronological')}
          onClick={() => handleModeClick('chronological')}
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
