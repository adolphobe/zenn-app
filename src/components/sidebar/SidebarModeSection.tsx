
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Clock, History, Power, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarSection from './SidebarSection';
import { useAppContext } from '@/context/AppContext';

interface SidebarModeSectionProps {
  sidebarOpen: boolean;
}

const SidebarModeSection: React.FC<SidebarModeSectionProps> = ({ sidebarOpen }) => {
  const { state: { viewMode }, toggleViewMode, setViewMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're currently on the strategic review page
  const isOnStrategicReview = location.pathname.includes('strategic-review');
  const isOnTaskHistory = location.pathname.includes('task-history');
  
  // Helper to get active class for navigation links
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
      viewMode === mode && !isOnStrategicReview && !isOnTaskHistory
        ? "bg-gray-100 dark:bg-gray-800 text-primary" 
        : "text-gray-700 dark:text-gray-300"
    );

  // Handler for mode switching
  const handleModeClick = (mode: string) => {
    // If we're on strategic review or task history, navigate to dashboard first
    if (isOnStrategicReview || isOnTaskHistory) {
      // Navigate to dashboard
      navigate('/dashboard');
      
      // Set the view mode (not toggle - explicitly set the desired mode)
      setViewMode(mode as any);
    } else {
      // Standard behavior when on dashboard - only switch if different mode
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
          to="/task-history-new" 
          className={getNavClass}
          title="Histórico"
        >
          <History className="w-5 h-5 mr-3" />
          {sidebarOpen && <span>Histórico</span>}
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
