
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Clock, History, Power, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarSection from './SidebarSection';
import { useAppContext } from '@/context/AppContext';
import SidebarNavItem from './SidebarNavItem';

interface SidebarModeSectionProps {
  sidebarOpen: boolean;
}

const SidebarModeSection: React.FC<SidebarModeSectionProps> = ({ sidebarOpen }) => {
  const { state: { viewMode }, toggleViewMode, setViewMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're currently on non-dashboard pages
  const isOnStrategicReview = location.pathname.includes('strategic-review');
  const isOnTaskHistory = location.pathname.includes('task-history');
  const isAlreadyOnDashboard = location.pathname === '/dashboard';
  
  // Handler for mode switching
  const handleModeClick = (mode: string) => {
    // Só navegue para o dashboard se não estivermos já lá
    if (!isAlreadyOnDashboard) {
      navigate('/dashboard');
    }
    
    // Explicitly set the view mode to ensure it works correctly
    setViewMode(mode as any);
  };

  // Determine if a mode is active
  const isModeActive = (mode: string) => {
    return viewMode === mode && !isOnStrategicReview && !isOnTaskHistory;
  };

  return (
    <SidebarSection 
      title="Navegação"
      sidebarOpen={sidebarOpen}
    >
      <div className="space-y-1 px-1">
        {/* Modo de Potência */}
        <SidebarNavItem 
          icon={Power}
          label="Modo de Potência"
          path="#"
          isActive={isModeActive('power')}
          onClick={() => handleModeClick('power')}
        />
        
        {/* Modo Cronológico */}
        <SidebarNavItem 
          icon={Clock}
          label="Modo Cronológico"
          path="#"
          isActive={isModeActive('chronological')}
          onClick={() => handleModeClick('chronological')}
        />
        
        {/* Histórico */}
        <SidebarNavItem 
          icon={History}
          label="Histórico"
          path="/task-history-new"
        />
        
        {/* Análise Estratégica */}
        <SidebarNavItem 
          icon={Calendar}
          label="Análise Estratégica"
          path="/strategic-review"
        />
      </div>
    </SidebarSection>
  );
};

export default SidebarModeSection;
