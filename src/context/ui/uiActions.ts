
import { AppDispatch } from '../types';
import { DateDisplayOptions, ViewMode } from '@/types';

// UI action creators
export const setViewMode = (dispatch: AppDispatch, mode: ViewMode): void => {
  dispatch({ type: 'SET_VIEW_MODE', payload: mode });
};

export const toggleShowHiddenTasks = (dispatch: AppDispatch): void => {
  dispatch({ type: 'TOGGLE_SHOW_HIDDEN_TASKS' });
};

export const toggleDarkMode = (dispatch: AppDispatch): void => {
  dispatch({ type: 'TOGGLE_DARK_MODE' });
};

export const toggleSidebar = (dispatch: AppDispatch): void => {
  dispatch({ type: 'TOGGLE_SIDEBAR' });
};

export const toggleShowPillars = (dispatch: AppDispatch, mode?: 'power' | 'chronological'): void => {
  dispatch({ type: 'TOGGLE_SHOW_PILLARS', payload: mode });
};

export const toggleShowDates = (dispatch: AppDispatch): void => {
  dispatch({ type: 'TOGGLE_SHOW_DATES' });
};

export const toggleShowScores = (dispatch: AppDispatch): void => {
  dispatch({ type: 'TOGGLE_SHOW_SCORES' });
};

export const updateDateDisplayOptions = (
  dispatch: AppDispatch, 
  options: Partial<DateDisplayOptions>
): void => {
  dispatch({ type: 'UPDATE_DATE_DISPLAY_OPTIONS', payload: options });
};

export const setSortOptions = (
  dispatch: AppDispatch, 
  options: {
    power?: { sortDirection: 'asc' | 'desc'; noDateAtEnd?: boolean };
    chronological?: { sortDirection: 'asc' | 'desc'; noDateAtEnd?: boolean };
  }
): void => {
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
