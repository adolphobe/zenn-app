
import { AppState, Action } from '../types';

// UI-related reducers
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
  
  return { ...state, viewMode: newMode };
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
