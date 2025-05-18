
import { AppState } from './types';
import { loadPreferencesFromLocalStorage } from '@/services/preferencesService';

// Get stored preferences from localStorage or use defaults
const getStoredPreferences = () => {
  try {
    return loadPreferencesFromLocalStorage();
  } catch (e) {
    console.error('Error accessing preferences from localStorage:', e);
    return null;
  }
};

// Get the stored preferences
const storedPreferences = getStoredPreferences();

// Define initial state with stored preferences or defaults
export const initialState: AppState = {
  tasks: [],
  viewMode: storedPreferences?.activeViewMode || 'power',
  showHiddenTasks: storedPreferences?.viewModeSettings?.power?.showHiddenTasks || false,
  darkMode: storedPreferences?.darkMode || false,
  sidebarOpen: storedPreferences?.sidebarOpen !== undefined ? storedPreferences.sidebarOpen : true,
  showPillars: storedPreferences?.viewModeSettings?.power?.showPillars !== undefined 
    ? storedPreferences.viewModeSettings.power.showPillars : false,
  showDates: storedPreferences?.viewModeSettings?.power?.showDates !== undefined 
    ? storedPreferences.viewModeSettings.power.showDates : true,
  showScores: storedPreferences?.viewModeSettings?.power?.showScores !== undefined 
    ? storedPreferences.viewModeSettings.power.showScores : true,
  
  // Initialize the mode-specific settings from stored state or defaults
  viewModeSettings: {
    power: {
      showHiddenTasks: storedPreferences?.viewModeSettings?.power?.showHiddenTasks !== undefined
        ? storedPreferences.viewModeSettings.power.showHiddenTasks
        : false,
      showPillars: storedPreferences?.viewModeSettings?.power?.showPillars !== undefined
        ? storedPreferences.viewModeSettings.power.showPillars
        : false,
      showDates: storedPreferences?.viewModeSettings?.power?.showDates !== undefined
        ? storedPreferences.viewModeSettings.power.showDates
        : true,
      showScores: storedPreferences?.viewModeSettings?.power?.showScores !== undefined
        ? storedPreferences.viewModeSettings.power.showScores
        : true,
    },
    chronological: {
      showHiddenTasks: storedPreferences?.viewModeSettings?.chronological?.showHiddenTasks !== undefined
        ? storedPreferences.viewModeSettings.chronological.showHiddenTasks
        : true, // Always true in chronological mode
      showPillars: storedPreferences?.viewModeSettings?.chronological?.showPillars !== undefined
        ? storedPreferences.viewModeSettings.chronological.showPillars
        : false,
      showDates: storedPreferences?.viewModeSettings?.chronological?.showDates !== undefined
        ? storedPreferences.viewModeSettings.chronological.showDates
        : false, // Hidden by default in chronological mode
      showScores: storedPreferences?.viewModeSettings?.chronological?.showScores !== undefined
        ? storedPreferences.viewModeSettings.chronological.showScores
        : true,
    },
  },
  
  dateDisplayOptions: {
    hideYear: storedPreferences?.dateDisplayOptions?.hideYear !== undefined 
      ? storedPreferences.dateDisplayOptions.hideYear 
      : false,
    hideTime: storedPreferences?.dateDisplayOptions?.hideTime !== undefined 
      ? storedPreferences.dateDisplayOptions.hideTime 
      : false,
    hideDate: storedPreferences?.dateDisplayOptions?.hideDate !== undefined 
      ? storedPreferences.dateDisplayOptions.hideDate 
      : false,
  },
  sortOptions: {
    power: {
      sortDirection: storedPreferences?.viewModeSettings?.power?.sortOptions?.sortDirection || 'desc',
      noDateAtEnd: storedPreferences?.viewModeSettings?.power?.sortOptions?.noDateAtEnd !== undefined 
        ? storedPreferences.viewModeSettings.power.sortOptions.noDateAtEnd 
        : true,
    },
    chronological: {
      sortDirection: storedPreferences?.viewModeSettings?.chronological?.sortOptions?.sortDirection || 'asc',
      noDateAtEnd: storedPreferences?.viewModeSettings?.chronological?.sortOptions?.noDateAtEnd !== undefined 
        ? storedPreferences.viewModeSettings.chronological.sortOptions.noDateAtEnd 
        : false,
    }
  }
};
