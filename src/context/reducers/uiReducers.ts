
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
  
  return { ...state, viewMode: action.payload };
};

export const toggleShowHiddenTasks = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_HIDDEN_TASKS') return state;
  return { ...state, showHiddenTasks: !state.showHiddenTasks };
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
  return { ...state, showPillars: !state.showPillars };
};

export const toggleShowDates = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_DATES') return state;
  return { ...state, showDates: !state.showDates };
};

export const toggleShowScores = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_SCORES') return state;
  return { ...state, showScores: !state.showScores };
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
