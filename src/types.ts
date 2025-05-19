
import { ISODateString } from './types/dates';

export interface Task {
  id: string;
  title: string;
  consequenceScore: number;
  prideScore: number;
  constructionScore: number;
  totalScore: number;
  idealDate: Date | null;
  hidden: boolean;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  feedback: 'transformed' | 'relief' | 'obligation' | null;
  comments?: Comment[];
  pillar?: string;
  is_power_extra?: boolean; // Nova propriedade para o recurso Potência Extra
  operationLoading: Record<string, boolean>;
  // Animation properties for task visibility transitions
  _pendingVisibilityUpdate?: boolean;
  _animationState?: 'hiding' | 'showing' | 'hidden' | 'visible';
  _optimisticUpdateTime?: number;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string; // Usamos userId em vez de user_id para ser consistente com o padrão camelCase do TypeScript
}

export interface TaskFormData {
  title: string;
  description?: string;
  consequenceScore?: number;
  prideScore?: number;
  constructionScore?: number;
  idealDate?: Date | null | string;
  pillar?: string;
  userId?: string;
  hidden?: boolean;
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
