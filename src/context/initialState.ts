
import { AppState } from './types';

// Initial state
export const initialState: AppState = {
  tasks: [],
  viewMode: 'power',
  showHiddenTasks: false,
  darkMode: false,
  sidebarOpen: true,
  autoMode: false, // Add autoMode with default value false
  dateDisplayOptions: {
    hideYear: false,
    hideTime: false,
    hideDate: false
  },
  sortOptions: {
    power: {
      sortDirection: 'desc',
    },
    chronological: {
      sortDirection: 'asc',
      noDateAtEnd: true
    }
  }
};
