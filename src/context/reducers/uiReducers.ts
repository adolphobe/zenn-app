import { AppState, Action } from '../types';

// UI-related reducers
export const toggleViewMode = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_VIEW_MODE') return state;
  
  const currentMode = state.viewMode;
  const newMode = currentMode === 'power' ? 'chronological' : 'power';
  
  return setViewMode(state, { type: 'SET_VIEW_MODE', payload: newMode });
};

export const setViewMode = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_VIEW_MODE') return state;
  
  // When switching view modes, update the global settings based on the new mode's settings
  const newMode = action.payload;
  const modeSettings = state.viewModeSettings[newMode];
  
  return { 
    ...state, 
    viewMode: newMode,
    // Sync global settings with mode-specific settings
    showHiddenTasks: modeSettings.showHiddenTasks,
    showPillars: modeSettings.showPillars,
    showDates: modeSettings.showDates,
    showScores: modeSettings.showScores
  };
};

export const toggleShowHiddenTasks = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_HIDDEN_TASKS') return state;
  
  const newValue = !state.showHiddenTasks;
  
  // Update both global setting and the current mode-specific setting
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

export const toggleShowPillars = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_PILLARS') return state;
  
  const newValue = !state.showPillars;
  
  // Update both global setting and the current mode-specific setting
  return { 
    ...state, 
    showPillars: newValue,
    viewModeSettings: {
      ...state.viewModeSettings,
      [state.viewMode]: {
        ...state.viewModeSettings[state.viewMode],
        showPillars: newValue
      }
    }
  };
};

export const toggleShowDates = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_DATES') return state;
  
  const newValue = !state.showDates;
  
  // Update both global setting and the current mode-specific setting
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
  
  // Update both global setting and the current mode-specific setting
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

export const updateDateDisplayOptions = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_DATE_DISPLAY_OPTIONS') return state;
  
  // Ensure all required properties are present
  const updatedOptions = {
    ...state.dateDisplayOptions,
    ...action.payload
  };
  
  return { ...state, dateDisplayOptions: updatedOptions };
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

export const setSortOptions = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_SORT_OPTIONS') return state;
  
  const options = action.payload;
  
  return {
    ...state,
    sortOptions: {
      ...state.sortOptions,
      [state.viewMode]: {
        ...state.sortOptions[state.viewMode],
        ...options
      }
    }
  };
};
