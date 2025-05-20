
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { ClipboardList, Layers, Calendar, Hash } from 'lucide-react'; 
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';
import { useAppState } from '@/context/hooks';
import { useLocation } from 'react-router-dom';

interface SidebarFilterSectionProps {
  sidebarOpen: boolean;
  isMobile?: boolean;
}

const SidebarFilterSection: React.FC<SidebarFilterSectionProps> = ({ sidebarOpen, isMobile = false }) => {
  const { 
    state, 
    toggleShowHiddenTasks,
    toggleShowPillars,
    toggleShowDates,
    toggleShowScores
  } = useAppContext();
  
  const { viewMode } = state;
  const location = useLocation();
  
  // Only show filters on the main dashboard route or mobile routes, and when in power or chronological view mode
  const isDashboardRoute = location.pathname === '/' || 
                          location.pathname === '/dashboard' || 
                          location.pathname.includes('/mobile/power') || 
                          location.pathname.includes('/mobile/chronological');
                          
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
  
  // On mobile, we use a slightly different UI style
  if (isMobile) {
    return (
      <div className="animate-fade-in space-y-3">
        <h3 className="text-sm font-medium mb-2">Opções de Exibição</h3>
        
        <div className="space-y-2">
          {/* Only show the hidden tasks toggle in power mode */}
          {viewMode === 'power' && (
            <div 
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer
                ${currentModeSettings.showHiddenTasks ? 'bg-primary/10' : 'hover:bg-muted'}
              `}
              onClick={toggleShowHiddenTasks}
            >
              <div className="flex items-center">
                <ClipboardList size={16} className="mr-2" />
                <span className="text-sm">Tarefas ocultas</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${currentModeSettings.showHiddenTasks ? 'bg-primary' : 'bg-gray-300'}`}></div>
            </div>
          )}
          
          <div 
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer
              ${currentModeSettings.showPillars ? 'bg-primary/10' : 'hover:bg-muted'}
            `}
            onClick={handleTogglePillars}
          >
            <div className="flex items-center">
              <Layers size={16} className="mr-2" />
              <span className="text-sm">Pilares no card</span>
            </div>
            <div className={`w-3 h-3 rounded-full ${currentModeSettings.showPillars ? 'bg-primary' : 'bg-gray-300'}`}></div>
          </div>
          
          {/* Only show date toggle in power mode */}
          {viewMode === 'power' && (
            <div 
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer
                ${currentModeSettings.showDates ? 'bg-primary/10' : 'hover:bg-muted'}
              `}
              onClick={toggleShowDates}
            >
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm">Data visível</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${currentModeSettings.showDates ? 'bg-primary' : 'bg-gray-300'}`}></div>
            </div>
          )}
          
          {/* Score toggle - only in chronological mode */}
          {isChronologicalMode && (
            <div 
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer
                ${currentModeSettings.showScores ? 'bg-primary/10' : 'hover:bg-muted'}
              `}
              onClick={toggleShowScores}
            >
              <div className="flex items-center">
                <Hash size={16} className="mr-2" />
                <span className="text-sm">{currentModeSettings.showScores ? "Ocultar Score" : "Mostrar Score"}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${currentModeSettings.showScores ? 'bg-primary' : 'bg-gray-300'}`}></div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Regular desktop UI
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
