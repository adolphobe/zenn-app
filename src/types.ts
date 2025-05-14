
export interface Task {
  id: string;
  title: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  totalScore: number;
  idealDate?: Date | null;
  hidden: boolean;
  completed: boolean;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  idealDate?: Date | null;
}

export type ViewMode = 'power' | 'chronological';

export interface DateDisplayOptions {
  hideYear: boolean;
  hideTime: boolean;
  hideDate: boolean;
}

export interface AppState {
  tasks: Task[];
  viewMode: ViewMode;
  showHiddenTasks: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  dateDisplayOptions: DateDisplayOptions;
}
