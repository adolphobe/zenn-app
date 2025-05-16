
import { AppState } from './types';
import { getLocalStorage } from '../utils';

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
  showScores: storedState.showScores !== undefined ? storedState.showScores : true, // Default to showing scores
  dateDisplayOptions: {
    showDate: storedState.dateDisplayOptions?.showDate !== undefined 
      ? storedState.dateDisplayOptions.showDate 
      : true,
    showTime: storedState.dateDisplayOptions?.showTime !== undefined 
      ? storedState.dateDisplayOptions.showTime 
      : true,
    showDayOfWeek: storedState.dateDisplayOptions?.showDayOfWeek !== undefined 
      ? storedState.dateDisplayOptions.showDayOfWeek 
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
