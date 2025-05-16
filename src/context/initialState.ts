
import { AppState } from './types';

// Initial state for the application
export const initialState: AppState = {
  tasks: [],
  viewMode: 'power',
  showHiddenTasks: false,
  darkMode: false,
  sidebarOpen: true,
  dateDisplayOptions: {
    hideYear: false,
    hideTime: false,
    hideDate: false
  },
  sortOptions: {
    power: {
      sortDirection: 'desc'
    },
    chronological: {
      sortDirection: 'asc',
      noDateAtEnd: true
    }
  }
};
