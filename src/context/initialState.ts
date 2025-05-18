import { AppState } from './types';

export const initialState: AppState = {
  tasks: [],
  viewMode: 'power', // Default view mode
  darkMode: false, // Default to light mode
  sidebarOpen: true, // Sidebar open by default
  sortOptions: {
    power: {
      sortDirection: 'desc', // Higher scores first
      noDateAtEnd: true
    },
    chronological: {
      sortDirection: 'asc', // Closer dates first
      noDateAtEnd: true
    }
  },
  dateDisplayOptions: {
    hideYear: false,
    hideTime: false,
    hideDate: false
  },
  // Display settings
  showHiddenTasks: false,
  showPillars: true,
  showDates: true,
  showScores: true,
  viewModeSettings: {
    power: {
      showHiddenTasks: false,
      showPillars: true,
      showDates: true,
      showScores: true,
    },
    chronological: {
      showHiddenTasks: false,
      showPillars: true,
      showDates: true,
      showScores: true,
    }
  },
  // New sync status field
  syncStatus: 'idle'
};
