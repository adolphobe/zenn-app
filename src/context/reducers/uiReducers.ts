import { AppState, Action } from '../types';

// UI-related reducers
export const setViewMode = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_VIEW_MODE') return state;
  
  // Store previous showDates setting when switching away from power mode
  const newViewMode = action.payload;
  
  if (newViewMode === 'chronological') {
    // When entering chronological mode, always show dates
    return { 
      ...state,
      viewMode: newViewMode,
      showDates: true, // Force dates to be visible in chronological mode
      _previousShowDates: state.showDates // Store the previous setting
    };
  } else if (newViewMode === 'power' && state.viewMode === 'chronological') {
    // When going back to power mode from chronological, restore previous date setting
    return {
      ...state, 
      viewMode: newViewMode,
      showDates: state._previousShowDates !== undefined ? state._previousShowDates : state.showDates
    };
  }
  
  // Default case: just update the view mode
  return { ...state, viewMode: newViewMode };
};

export const toggleShowHiddenTasks = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_HIDDEN_TASKS') return state;
  return { ...state, showHiddenTasks: !state.showHiddenTasks };
};

export const toggleShowPillars = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_PILLARS') return state;
  return { ...state, showPillars: !state.showPillars };
};

export const toggleShowDates = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_SHOW_DATES') return state;
  
  // In chronological mode, we can't hide dates
  if (state.viewMode === 'chronological') {
    return state; // Don't allow toggling dates off in chronological mode
  }
  
  return { ...state, showDates: !state.showDates };
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
  return { ...state, dateDisplayOptions: action.payload };
};

export const setSortOptions = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_SORT_OPTIONS') return state;
  
  const { sortDirection, noDateAtEnd } = action.payload;
  const viewMode = state.viewMode;
  
  return {
    ...state,
    sortOptions: {
      ...state.sortOptions,
      [viewMode]: {
        ...state.sortOptions[viewMode],
        sortDirection,
        ...(viewMode === 'chronological' && noDateAtEnd !== undefined ? { noDateAtEnd } : {})
      }
    }
  };
};
