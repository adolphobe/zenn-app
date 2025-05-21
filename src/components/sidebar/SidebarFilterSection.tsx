
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { ClipboardList, Layers, Calendar, Hash } from 'lucide-react'; 
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';
import { useAppState } from '@/context/hooks';
import { useLocation } from 'react-router-dom';

const SidebarFilterSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state, 
    toggleShowHiddenTasks,
    toggleShowPillars,
    toggleShowDates,
    toggleShowScores
  } = useAppContext();
  
  const { viewMode } = state;
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
  
  // Get the current mode settings
  const currentModeSettings = state.viewModeSettings[viewMode];
  
  // Handle mode-specific toggles
  const handleTogglePillars = () => toggleShowPillars(viewMode);
  
  return (
    <div className="animate-fade-in">
      <SidebarSection title="Exibir" sidebarOpen={sidebarOpen}>
        {/* Only show the hidden tasks toggle in power mode */}
        {viewMode === 'power' && (
          <SidebarNavItem
            icon={ClipboardList}
            label="Tarefas ocultas"
            path="#"
            isActive={currentModeSettings.showHiddenTasks}
            onClick={toggleShowHiddenTasks}
            isFilter={true} // Mark as a filter item
          />
        )}
        <SidebarNavItem
          icon={Layers}
          label="Pilares no card"
          path="#"
          isActive={currentModeSettings.showPillars}
          onClick={handleTogglePillars}
          isFilter={true} // Mark as a filter item
        />
        {/* Only show date toggle in power mode */}
        {viewMode === 'power' && (
          <SidebarNavItem
            icon={Calendar}
            label="Data visível"
            path="#"
            isActive={currentModeSettings.showDates}
            onClick={toggleShowDates}
            isFilter={true} // Mark as a filter item
          />
        )}
        {/* Score toggle - only in chronological mode */}
        {isChronologicalMode && (
          <SidebarNavItem
            icon={Hash}
            label={currentModeSettings.showScores ? "Ocultar Score" : "Mostrar Score"}
            path="#"
            isActive={currentModeSettings.showScores}
            onClick={toggleShowScores}
            isFilter={true} // Mark as a filter item
          />
        )}
      </SidebarSection>
    </div>
  );
};

export default SidebarFilterSection;
