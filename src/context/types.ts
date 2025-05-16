
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
  // Adicionar flags para controlar a exibição de pilares e datas
  showPillars: boolean;
  showDates: boolean;
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
  | { type: 'DELETE_COMMENT'; payload: { taskId: string; commentId: string } }
  | { type: 'TOGGLE_SHOW_PILLARS' }
  | { type: 'TOGGLE_SHOW_DATES' }
  | { type: 'SET_SORT_OPTIONS'; payload: { sortDirection: 'asc' | 'desc'; noDateAtEnd?: boolean } };

// AppDispatch type
export type AppDispatch = Dispatch<Action>;

// AppContextType definition
export interface AppContextType {
  state: AppState;
  dispatch: AppDispatch;
  addTask: (task: any) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  toggleTaskHidden: (id: string) => void;
  updateTask: (id: string, data: Partial<any>) => void;
  updateTaskTitle: (id: string, title: string) => void;
  setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => void;
  restoreTask: (id: string) => void;
  addComment: (taskId: string, text: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleShowHiddenTasks: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateDateDisplayOptions: (options: Partial<DateDisplayOptions>) => void;
  setSortOptions: (options: { sortDirection: 'asc' | 'desc'; noDateAtEnd?: boolean }) => void;
  // Adicionar novos métodos
  toggleShowPillars: () => void;
  toggleShowDates: () => void;
}
