
import { ViewMode, SortOption } from '../types';

export interface UserPreferences {
  darkMode: boolean;
  activeViewMode: ViewMode;
  sidebarOpen: boolean;
  viewModeSettings: {
    power: {
      showHiddenTasks: boolean;
      showPillars: boolean;
      showDates: boolean;
      showScores: boolean;
      sortOptions: SortOption;
    };
    chronological: {
      showHiddenTasks: boolean;
      showPillars: boolean;
      showDates: boolean;
      showScores: boolean;
      sortOptions: SortOption;
    };
  };
  dateDisplayOptions: {
    hideYear: boolean;
    hideTime: boolean;
    hideDate: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real DB implementation, this would be a hashed password
  profileImage?: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
}
