
import { Task, DateDisplayOptions, ViewMode, SortOption, TaskFormData as BaseTaskFormData } from '../types';
import { Dispatch } from 'react';

// Define ViewModeSettings to store mode-specific settings
export interface ViewModeSettings {
  showHiddenTasks: boolean;
  showPillars: boolean;
  showDates: boolean;
  showScores: boolean;
}

// Define AppState
export interface AppState {
  tasks: Task[];
  viewMode: ViewMode;
  darkMode: boolean;
  sidebarOpen: boolean;
  dateDisplayOptions: DateDisplayOptions;
  sortOptions: {
    power: SortOption;
    chronological: SortOption;
  };
  // Mode-specific settings
  viewModeSettings: {
    power: ViewModeSettings;
    chronological: ViewModeSettings;
  };
  // These remain as global settings (backward compatibility)
  showHiddenTasks: boolean;
  showPillars: boolean;
  showDates: boolean;
  showScores: boolean;
  // New sync status field
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

// Define Action
export type Action = 
  | { type: 'ADD_TASK'; payload: any }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: string }
  | { type: 'TOGGLE_TASK_HIDDEN'; payload: string }
  | { type: 'UPDATE_TASK_VISIBILITY_CONFIRMED'; payload: { id: string; hidden: boolean } }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<any> } }
  | { type: 'UPDATE_TASK_TITLE'; payload: { id: string; title: string } }
  | { type: 'CLEAR_TASKS' }
  | { type: 'COMPLETE_TASK_BY_TITLE'; payload: string }
  | { type: 'COMPLETE_TASK_WITH_DATE'; payload: { title: string; completedAt: Date | string | null } }
  | { type: 'SET_TASK_FEEDBACK'; payload: { id: string; feedback: 'transformed' | 'relief' | 'obligation' } }
  | { type: 'SET_TASK_FEEDBACK_BY_TITLE'; payload: { title: string; feedback: 'transformed' | 'relief' | 'obligation' } }
  | { type: 'RESTORE_TASK'; payload: string }
  | { type: 'TOGGLE_VIEW_MODE' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_SHOW_HIDDEN_TASKS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_DATE_DISPLAY_OPTIONS'; payload: Partial<DateDisplayOptions> }
  | { type: 'UPDATE_SORT_OPTIONS'; payload: { viewMode: 'power' | 'chronological'; options: Partial<SortOption> } }
  | { type: 'ADD_COMMENT'; payload: { taskId: string; text?: string; comment?: any } }
  | { type: 'DELETE_COMMENT'; payload: { taskId: string; commentId: string } }
  | { type: 'TOGGLE_SHOW_PILLARS' }
  | { type: 'TOGGLE_SHOW_DATES' }
  | { type: 'TOGGLE_SHOW_SCORES' }
  | { type: 'SET_SORT_OPTIONS'; payload: { sortDirection: 'asc' | 'desc'; noDateAtEnd?: boolean } }
  | { type: 'SET_TASK_OPERATION_LOADING'; payload: { id: string, operation: string, loading: boolean } }
  | { type: 'SET_SYNC_STATUS'; payload: 'idle' | 'syncing' | 'synced' | 'error' };

// AppDispatch type
export type AppDispatch = Dispatch<Action>;

// AppContextType definition
export interface AppContextType {
  state: AppState;
  dispatch: AppDispatch;
  
  // Task actions
  addTask: (task: BaseTaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  toggleTaskHidden: (id: string) => void;
  updateTask: (id: string, data: Partial<BaseTaskFormData>) => void;
  updateTaskTitle: (id: string, title: string) => void;
  setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => void;
  restoreTask: (id: string) => void;
  addComment: (taskId: string, text: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  syncTasksWithDatabase: (forceSync?: boolean) => Promise<Task[] | null>;
  
  // UI actions
  setViewMode: (mode: ViewMode) => void;
  toggleShowHiddenTasks: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleShowPillars: () => void;
  toggleShowDates: () => void;
  toggleShowScores: () => void;
  updateDateDisplayOptions: (options: Partial<DateDisplayOptions>) => void;
  setSortOptions: (options: SortOptionsUpdate) => void;
  toggleViewMode: () => void; // Adding the missing toggleViewMode function
}

// Reuse TaskFormData from main types file
export type TaskFormData = BaseTaskFormData;

export type SortOptionsUpdate = {
  [key in 'power' | 'chronological']?: {
    sortDirection: 'asc' | 'desc';
    noDateAtEnd?: boolean;
  };
};
