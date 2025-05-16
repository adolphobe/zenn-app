
import { AppState } from './types';

// Define simple localStorage helper function directly in this file
const getLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Error accessing localStorage:', e);
    return null;
  }
};

// Get stored state from localStorage or use defaults
const getStoredState = () => {
  const storedState = getLocalStorage('app_state');
  return storedState ? JSON.parse(storedState) : {};
};

// Get the stored state
const storedState = getStoredState();

// Define initial state with stored values or defaults
export const initialState: AppState = {
  tasks: [],
  viewMode: storedState.viewMode || 'power',
  showHiddenTasks: storedState.showHiddenTasks || false,
  darkMode: storedState.darkMode || false,
  sidebarOpen: storedState.sidebarOpen !== undefined ? storedState.sidebarOpen : true,
  showPillars: storedState.showPillars !== undefined ? storedState.showPillars : false,
  showDates: storedState.showDates !== undefined ? storedState.showDates : true,
  showScores: storedState.showScores !== undefined ? storedState.showScores : true,
  
  // Initialize the mode-specific settings from stored state or defaults
  viewModeSettings: {
    power: {
      showHiddenTasks: storedState.viewModeSettings?.power?.showHiddenTasks !== undefined
        ? storedState.viewModeSettings.power.showHiddenTasks
        : false,
      showPillars: storedState.viewModeSettings?.power?.showPillars !== undefined
        ? storedState.viewModeSettings.power.showPillars
        : false,
      showDates: storedState.viewModeSettings?.power?.showDates !== undefined
        ? storedState.viewModeSettings.power.showDates
        : true,
      showScores: storedState.viewModeSettings?.power?.showScores !== undefined
        ? storedState.viewModeSettings.power.showScores
        : true,
    },
    chronological: {
      showHiddenTasks: storedState.viewModeSettings?.chronological?.showHiddenTasks !== undefined
        ? storedState.viewModeSettings.chronological.showHiddenTasks
        : true, // Always true in chronological mode
      showPillars: storedState.viewModeSettings?.chronological?.showPillars !== undefined
        ? storedState.viewModeSettings.chronological.showPillars
        : false,
      showDates: storedState.viewModeSettings?.chronological?.showDates !== undefined
        ? storedState.viewModeSettings.chronological.showDates
        : false, // Hidden by default in chronological mode
      showScores: storedState.viewModeSettings?.chronological?.showScores !== undefined
        ? storedState.viewModeSettings.chronological.showScores
        : true,
    },
  },
  
  dateDisplayOptions: {
    hideYear: storedState.dateDisplayOptions?.hideYear !== undefined 
      ? storedState.dateDisplayOptions.hideYear 
      : false,
    hideTime: storedState.dateDisplayOptions?.hideTime !== undefined 
      ? storedState.dateDisplayOptions.hideTime 
      : false,
    hideDate: storedState.dateDisplayOptions?.hideDate !== undefined 
      ? storedState.dateDisplayOptions.hideDate 
      : false,
  },
  sortOptions: {
    power: {
      sortDirection: storedState.sortOptions?.power?.sortDirection || 'desc',
      noDateAtEnd: storedState.sortOptions?.power?.noDateAtEnd !== undefined 
        ? storedState.sortOptions.power.noDateAtEnd 
        : true,
    },
    chronological: {
      sortDirection: storedState.sortOptions?.chronological?.sortDirection || 'asc',
      noDateAtEnd: storedState.sortOptions?.chronological?.noDateAtEnd !== undefined 
        ? storedState.sortOptions.chronological.noDateAtEnd 
        : false,
    }
  }
};
