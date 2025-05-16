
import { ViewMode, DateDisplayOptions, SortDirection } from '@/types';
import { AppDispatch } from '../types';

// UI-related actions
export const setViewMode = (dispatch: AppDispatch, mode: ViewMode) => {
  dispatch({ type: 'SET_VIEW_MODE', payload: mode });
};

export const toggleShowHiddenTasks = (dispatch: AppDispatch) => {
  dispatch({ type: 'TOGGLE_SHOW_HIDDEN_TASKS' });
};

export const toggleDarkMode = (dispatch: AppDispatch) => {
  dispatch({ type: 'TOGGLE_DARK_MODE' });
};

export const toggleSidebar = (dispatch: AppDispatch) => {
  dispatch({ type: 'TOGGLE_SIDEBAR' });
};

export const updateDateDisplayOptions = (dispatch: AppDispatch, options: Partial<DateDisplayOptions>) => {
  dispatch({ type: 'UPDATE_DATE_DISPLAY_OPTIONS', payload: options });
};

export const setSortOptions = (
  dispatch: AppDispatch, 
  options: { sortDirection: SortDirection; noDateAtEnd?: boolean }
) => {
  dispatch({ 
    type: 'UPDATE_SORT_OPTIONS', 
    payload: { 
      viewMode: 'chronological', 
      options 
    } 
  });
};
