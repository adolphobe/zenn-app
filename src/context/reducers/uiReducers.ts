
import { AppState, Action } from '../types';

// UI-related reducers
export const setViewMode = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_VIEW_MODE') return state;
  
  const newViewMode = action.payload;
  
  // Update global settings to reflect the mode-specific settings
  return { 
    ...state, 
    viewMode: newViewMode,
    // Sync global settings with mode-specific settings when changing modes
    showHiddenTasks: state.viewModeSettings[newViewMode].showHiddenTasks,
    showPillars: state.viewModeSettings[newViewMode].showPillars,
    showDates: state.viewModeSettings[newViewMode].showDates,
    showScores: state.viewModeSettings[newViewMode].showScores,
  };
};

export const toggleShowHiddenTasks = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_HIDDEN_TASKS') return state;
  
  const newValue = !state.showHiddenTasks;
  
  return {
    ...state,
    showHiddenTasks: newValue,
    viewModeSettings: {
      ...state.viewModeSettings,
      [state.viewMode]: {
        ...state.viewModeSettings[state.viewMode],
        showHiddenTasks: newValue
      }
    }
  };
};

export const toggleDarkMode = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_DARK_MODE') return state;
  return { ...state, darkMode: !state.darkMode };
};

export const toggleSidebar = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SIDEBAR') return state;
  return { ...state, sidebarOpen: !state.sidebarOpen };
};

export const updateDateDisplayOptions = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_DATE_DISPLAY_OPTIONS') return state;
  return {
    ...state,
    dateDisplayOptions: {
      ...state.dateDisplayOptions,
      ...action.payload
    }
  };
};

export const updateSortOptions = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_SORT_OPTIONS') return state;
  const { viewMode, options } = action.payload;
  
  return {
    ...state,
    sortOptions: {
      ...state.sortOptions,
      [viewMode]: {
        ...state.sortOptions[viewMode],
        ...options
      }
    }
  };
};

export const toggleViewMode = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_VIEW_MODE') return state;
  
  const currentMode = state.viewMode;
  const newMode = currentMode === 'power' ? 'chronological' : 'power';
  
  return { 
    ...state, 
    viewMode: newMode,
    // Sync global settings with mode-specific settings when changing modes
    showHiddenTasks: state.viewModeSettings[newMode].showHiddenTasks,
    showPillars: state.viewModeSettings[newMode].showPillars,
    showDates: state.viewModeSettings[newMode].showDates,
    showScores: state.viewModeSettings[newMode].showScores,
  };
};

export const toggleShowPillars = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_PILLARS') return state;
  
  // Get specific mode or use current mode
  const mode = action.payload || state.viewMode;
  const newValue = !state.viewModeSettings[mode].showPillars;
  
  // Only update the global state if we're toggling the current mode
  const updatedGlobalShowPillars = mode === state.viewMode ? newValue : state.showPillars;
  
  return {
    ...state,
    showPillars: updatedGlobalShowPillars,
    viewModeSettings: {
      ...state.viewModeSettings,
      [mode]: {
        ...state.viewModeSettings[mode],
        showPillars: newValue
      }
    }
  };
};

export const toggleShowDates = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_DATES') return state;
  
  const newValue = !state.showDates;
  
  return {
    ...state, 
    showDates: newValue,
    viewModeSettings: {
      ...state.viewModeSettings,
      [state.viewMode]: {
        ...state.viewModeSettings[state.viewMode],
        showDates: newValue
      }
    }
  };
};

export const toggleShowScores = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_SCORES') return state;
  
  const newValue = !state.showScores;
  
  return {
    ...state,
    showScores: newValue,
    viewModeSettings: {
      ...state.viewModeSettings,
      [state.viewMode]: {
        ...state.viewModeSettings[state.viewMode],
        showScores: newValue
      }
    }
  };
};

export const setSortOptions = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_SORT_OPTIONS') return state;
  
  const { sortDirection, noDateAtEnd } = action.payload;
  
  return {
    ...state,
    sortOptions: {
      ...state.sortOptions,
      [state.viewMode]: {
        sortDirection,
        noDateAtEnd: noDateAtEnd !== undefined ? noDateAtEnd : state.sortOptions[state.viewMode].noDateAtEnd
      }
    }
  };
};

// Add this at the end of your file
export const setSyncStatus = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_SYNC_STATUS') return state;
  return {
    ...state,
    syncStatus: action.payload
  };
};
