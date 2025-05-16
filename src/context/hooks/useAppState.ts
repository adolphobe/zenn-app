
import { useAppContext } from '../AppContext';

/**
 * Custom hook providing access to app state
 */
export const useAppState = () => {
  const { state } = useAppContext();
  
  return {
    tasks: state.tasks,
    viewMode: state.viewMode,
    showHiddenTasks: state.showHiddenTasks,
    showPillars: state.showPillars,
    showDates: state.showDates,
    showScores: state.showScores,
    darkMode: state.darkMode,
    sidebarOpen: state.sidebarOpen,
    dateDisplayOptions: state.dateDisplayOptions,
    sortOptions: state.sortOptions,
    viewModeSettings: state.viewModeSettings
  };
};
