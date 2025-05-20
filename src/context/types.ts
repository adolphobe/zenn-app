
import { Task, TaskFormData, ViewMode, DateDisplayOptions, SortDirection, SortOption, Comment } from '../types';

// Definição do estado da aplicação
export interface AppState {
  tasks: Task[];
  viewMode: ViewMode;
  showHiddenTasks: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  dateDisplayOptions: DateDisplayOptions;
  showPillars: boolean;
  showDates: boolean;
  showScores: boolean;
  viewModeSettings: {
    power: ViewModeSettings;
    chronological: ViewModeSettings;
    strategic: ViewModeSettings;
  };
  sortOptions: {
    power: SortOption;
    chronological: SortOption;
  };
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
}

// Definição das configurações de visualização para cada modo
export interface ViewModeSettings {
  showHiddenTasks: boolean;
  showPillars: boolean;
  showDates: boolean;
  showScores: boolean;
}

// Definição para atualização de opções de ordenação
export interface SortOptionsUpdate {
  power?: Partial<SortOption>;
  chronological?: Partial<SortOption>;
}

// Definição do tipo de ação para o reducer
export type Action =
  | { type: 'ADD_TASK'; payload: TaskFormData & { userId?: string } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: string }
  | { type: 'TOGGLE_TASK_HIDDEN'; payload: string }
  | { type: 'UPDATE_TASK_VISIBILITY_CONFIRMED'; payload: { id: string; hidden: boolean } }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<TaskFormData> } }
  | { type: 'UPDATE_TASK_TITLE'; payload: { id: string; title: string } }
  | { type: 'SET_TASK_OPERATION_LOADING'; payload: { id: string; operation: string; loading: boolean } }
  | { type: 'SET_TASK_FEEDBACK'; payload: { id: string; feedback: 'transformed' | 'relief' | 'obligation' | null } }
  | { type: 'SET_TASK_FEEDBACK_BY_TITLE'; payload: { title: string; feedback: 'transformed' | 'relief' | 'obligation' | null } }
  | { type: 'COMPLETE_TASK_BY_TITLE'; payload: string }
  | { type: 'COMPLETE_TASK_WITH_DATE'; payload: { title: string; completedAt: string | Date } }
  | { type: 'RESTORE_TASK'; payload: string }
  | { type: 'CLEAR_TASKS' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_VIEW_MODE' }
  | { type: 'TOGGLE_SHOW_HIDDEN_TASKS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_SHOW_PILLARS'; payload?: 'power' | 'chronological' }
  | { type: 'TOGGLE_SHOW_DATES' }
  | { type: 'TOGGLE_SHOW_SCORES' }
  | { type: 'UPDATE_DATE_DISPLAY_OPTIONS'; payload: Partial<DateDisplayOptions> }
  | { type: 'UPDATE_SORT_OPTIONS'; payload: { viewMode: 'power' | 'chronological'; options: Partial<SortOption> } }
  | { type: 'SET_SORT_OPTIONS'; payload: { sortDirection: SortDirection; noDateAtEnd?: boolean } }
  | { type: 'SET_SYNC_STATUS'; payload: 'idle' | 'syncing' | 'synced' | 'error' }
  | { type: 'ADD_COMMENT'; payload: { taskId: string; text?: string; comment?: Comment } }
  | { type: 'DELETE_COMMENT'; payload: { taskId: string; commentId: string } };

// Definição do tipo de dispatch
export type AppDispatch = (action: Action) => void;

// Interface do contexto
export interface AppContextType {
  state: AppState;
  dispatch: AppDispatch;
  addTask: (task: TaskFormData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
  toggleTaskHidden: (id: string) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  updateTaskTitle: (id: string, title: string) => Promise<void>;
  setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => Promise<void>;
  restoreTask: (id: string) => Promise<void>;
  syncTasksWithDatabase: (forceSync?: boolean) => Promise<Task[] | null>;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  toggleShowHiddenTasks: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleShowPillars: (mode?: 'power' | 'chronological') => void;
  toggleShowDates: () => void;
  toggleShowScores: () => void;
  updateDateDisplayOptions: (options: Partial<DateDisplayOptions>) => void;
  setSortOptions: (options: SortOptionsUpdate) => void;
}
