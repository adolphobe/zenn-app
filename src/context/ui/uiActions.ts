
import { AppDispatch } from '../types';
import { ViewMode, DateDisplayOptions, SortOption } from '@/types';
import { SortOptionsUpdate } from '../types';

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

export const toggleShowPillars = (dispatch: AppDispatch) => {
  dispatch({ type: 'TOGGLE_SHOW_PILLARS' });
};

export const toggleShowDates = (dispatch: AppDispatch) => {
  dispatch({ type: 'TOGGLE_SHOW_DATES' });
};

export const toggleShowScores = (dispatch: AppDispatch) => {
  dispatch({ type: 'TOGGLE_SHOW_SCORES' });
};

export const updateDateDisplayOptions = (dispatch: AppDispatch, options: Partial<DateDisplayOptions>) => {
  dispatch({ type: 'UPDATE_DATE_DISPLAY_OPTIONS', payload: options });
};

export const setSortOptions = (dispatch: AppDispatch, options: SortOptionsUpdate) => {
  // Check which mode is being updated
  if (options.power) {
    dispatch({
      type: 'UPDATE_SORT_OPTIONS',
      payload: {
        viewMode: 'power',
        options: options.power
      }
    });
  }
  
  if (options.chronological) {
    dispatch({
      type: 'UPDATE_SORT_OPTIONS',
      payload: {
        viewMode: 'chronological',
        options: options.chronological
      }
    });
  }
};
