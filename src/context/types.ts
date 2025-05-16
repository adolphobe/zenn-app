
import { Task, DateDisplayOptions, ViewMode, SortOption } from '../types';
import { Dispatch } from 'react';

// Define AppState
export interface AppState {
  tasks: Task[];
  viewMode: ViewMode;
  showHiddenTasks: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  dateDisplayOptions: DateDisplayOptions;
  sortOptions: {
    power: SortOption;
    chronological: SortOption;
  };
}

// Define Action
export type Action = 
  | { type: 'ADD_TASK'; payload: any }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: string }
  | { type: 'TOGGLE_TASK_HIDDEN'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<any> } }
  | { type: 'UPDATE_TASK_TITLE'; payload: { id: string; title: string } }
  | { type: 'CLEAR_TASKS' }
  | { type: 'COMPLETE_TASK_BY_TITLE'; payload: string }
  | { type: 'COMPLETE_TASK_WITH_DATE'; payload: { title: string; completedAt: string } }
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
  | { type: 'ADD_COMMENT'; payload: { taskId: string; text: string } }
  | { type: 'DELETE_COMMENT'; payload: { taskId: string; commentId: string } };

// AppDispatch type
export type AppDispatch = Dispatch<Action>;
