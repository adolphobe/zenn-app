
import React from 'react';
import { useAppContext } from '@/context/AppContext';

interface MobileFilterMenuProps {
  onClose?: () => void;
}

const MobileFilterMenu: React.FC<MobileFilterMenuProps> = ({ onClose }) => {
  const {
    state: { viewMode, showHiddenTasks, showPillars, showDates, showScores },
    toggleShowHiddenTasks,
    toggleShowPillars,
    toggleShowDates,
    toggleShowScores
  } = useAppContext();

  // Determine which filters to show based on view mode
  const showHiddenTasksFilter = viewMode === 'power';
  const showDatesFilter = viewMode === 'power';
  const showScoresFilter = viewMode === 'chronological';

  // Get the mode-specific settings
  const viewModeSettings = useAppContext().state.viewModeSettings[viewMode];

  const handleToggle = (action: () => void) => {
    action();
    // Optionally close popover after selecting
    if (onClose) onClose();
  };

  return (
    <div className="space-y-2">
      {showHiddenTasksFilter && (
        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm flex items-center"
          onClick={() => handleToggle(toggleShowHiddenTasks)}
        >
          <div className={`w-3 h-3 rounded-full mr-2 ${viewModeSettings.showHiddenTasks ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          Tarefas ocultas
        </button>
      )}

      <button
        className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm flex items-center"
        onClick={() => handleToggle(toggleShowPillars)}
      >
        <div className={`w-3 h-3 rounded-full mr-2 ${viewModeSettings.showPillars ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        Pilares no card
      </button>

      {showDatesFilter && (
        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm flex items-center"
          onClick={() => handleToggle(toggleShowDates)}
        >
          <div className={`w-3 h-3 rounded-full mr-2 ${viewModeSettings.showDates ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          Data visível
        </button>
      )}

      {showScoresFilter && (
        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm flex items-center"
          onClick={() => handleToggle(toggleShowScores)}
        >
          <div className={`w-3 h-3 rounded-full mr-2 ${viewModeSettings.showScores ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          Mostrar Score
        </button>
      )}
    </div>
  );
};

export default MobileFilterMenu;
