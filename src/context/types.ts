import { Task, TaskFormData, ViewMode, DateDisplayOptions, SortDirection } from '../types';

// Actions
export type Action =
  | { type: 'ADD_TASK'; payload: TaskFormData }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: string }
  | { type: 'TOGGLE_TASK_HIDDEN'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<TaskFormData> } }
  | { type: 'UPDATE_TASK_TITLE'; payload: { id: string; title: string } }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_SHOW_HIDDEN_TASKS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_DATE_DISPLAY_OPTIONS'; payload: DateDisplayOptions }
  | { type: 'SET_SORT_OPTIONS'; payload: { sortDirection: SortDirection; noDateAtEnd?: boolean } }
  | { type: 'SET_TASK_FEEDBACK'; payload: { id: string; feedback: 'transformed' | 'relief' | 'obligation' } }
  | { type: 'COMPLETE_TASK_BY_TITLE'; payload: string }
  | { type: 'SET_TASK_FEEDBACK_BY_TITLE'; payload: { title: string; feedback: 'transformed' | 'relief' | 'obligation' } };

// Context interface
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addTask: (task: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  toggleTaskHidden: (id: string) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  updateTaskTitle: (id: string, title: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleShowHiddenTasks: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateDateDisplayOptions: (options: DateDisplayOptions) => void;
  setSortOptions: (options: { sortDirection: SortDirection; noDateAtEnd?: boolean }) => void;
  setTaskFeedback?: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => void;
}

export interface AppState {
  tasks: Task[];
  viewMode: ViewMode;
  showHiddenTasks: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  dateDisplayOptions: {
    hideYear: boolean;
    hideTime: boolean;
    hideDate: boolean
  };
  sortOptions: {
    power: {
      sortDirection: SortDirection;
    };
    chronological: {
      sortDirection: SortDirection;
      noDateAtEnd: boolean;
    };
  };
}
