
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { ClipboardList, Layers, Calendar } from 'lucide-react'; 
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';
import { useAppState } from '@/context/hooks';
import { useLocation } from 'react-router-dom';

const SidebarFilterSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { showHiddenTasks, showPillars, showDates }, 
    toggleShowHiddenTasks,
    toggleShowPillars,
    toggleShowDates
  } = useAppContext();
  const { viewMode } = useAppState();
  const location = useLocation();
  
  // Only show filters on the main dashboard route (/) and when in power or chronological view mode
  const isDashboardRoute = location.pathname === '/' || location.pathname === '/dashboard';
  const isCorrectViewMode = viewMode === 'power' || viewMode === 'chronological';
  
  // Hide the entire section if we're not on the dashboard route or not in the correct view modes
  if (!isDashboardRoute || !isCorrectViewMode) {
    return null;
  }
  
  // Check if we're in chronological mode
  const isChronologicalMode = viewMode === 'chronological';
  
  return (
    <div className="animate-fade-in">
      <SidebarSection title="Exibir" sidebarOpen={sidebarOpen}>
        {/* Only show the hidden tasks toggle in power mode */}
        {viewMode === 'power' && (
          <SidebarNavItem
            icon={ClipboardList}
            label="Tarefas ocultas"
            path="#"
            isActive={showHiddenTasks}
            onClick={toggleShowHiddenTasks}
            isFilter={true} // Mark as a filter item
          />
        )}
        <SidebarNavItem
          icon={Layers}
          label="Pilares no card"
          path="#"
          isActive={showPillars}
          onClick={toggleShowPillars}
          isFilter={true} // Mark as a filter item
        />
        {/* Only show date toggle in power mode */}
        {viewMode === 'power' && (
          <SidebarNavItem
            icon={Calendar}
            label="Data visível"
            path="#"
            isActive={showDates}
            onClick={toggleShowDates}
            isFilter={true} // Mark as a filter item
          />
        )}
      </SidebarSection>
    </div>
  );
};

export default SidebarFilterSection;
