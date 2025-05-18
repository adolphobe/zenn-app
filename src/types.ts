
export interface Task {
  id: string;
  title: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  totalScore: number;
  idealDate: Date | string | null;
  hidden: boolean;
  completed: boolean;
  completedAt?: string | null;
  createdAt: Date | string;
  feedback: 'transformed' | 'relief' | 'obligation' | null;
  comments: Comment[];
  pillar?: string | null;
  operationLoading?: Record<string, boolean>;
  _optimisticUpdateTime?: number; // Add this property for animation tracking
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  idealDate?: Date | string | null;  // Updated to match Task.idealDate
  completedAt?: string;
  feedback?: 'transformed' | 'relief' | 'obligation';
  pillar?: string;
  date?: string;
}

export type ViewMode = 'power' | 'chronological' | 'strategic';
export type SortDirection = 'asc' | 'desc';
export type SortOption = {
  sortDirection: SortDirection;
  noDateAtEnd?: boolean;
};

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
  sortOptions: {
    power: SortOption;
    chronological: SortOption;
  };
}
