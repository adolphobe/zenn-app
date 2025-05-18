
import { ISODateString } from './types/dates';

export interface Task {
  id: string;
  title: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  totalScore: number;
  idealDate: Date | null;  // Internamente sempre Date | null
  hidden: boolean;
  completed: boolean;
  completedAt: Date | null;  // Internamente sempre Date | null
  createdAt: Date;  // Sempre Date internamente
  feedback: 'transformed' | 'relief' | 'obligation' | null;
  comments: Comment[];
  pillar?: string | null;
  operationLoading?: Record<string, boolean>;
  _optimisticUpdateTime?: number; // Propriedade para acompanhamento de animações
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
  idealDate: Date | null;  // Padronizado para Date | null internamente
  completedAt?: Date | null;  // Padronizado para Date | null
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
