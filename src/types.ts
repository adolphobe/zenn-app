
import { ISODateString } from './types/dates';

export interface Task {
  id: string;
  title: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  totalScore: number;
  idealDate: Date | null;
  completed: boolean;
  completedAt: Date | null;
  hidden: boolean;
  feedback?: 'transformed' | 'relief' | 'obligation';
  comments: Comment[];
  createdAt: Date;
  pillar?: string | null;
  isDeleted?: boolean;
  operationLoading?: Record<string, boolean>;
  _optimisticUpdateTime?: number;
  _pendingHiddenUpdate?: boolean;
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
  idealDate: Date | null;
  completedAt?: Date | null;
  feedback?: 'transformed' | 'relief' | 'obligation';
  pillar?: string;
  date?: ISODateString;
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
