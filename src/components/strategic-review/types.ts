
export type PeriodType = 'today' | 'yesterday' | 'week' | 'month' | 'custom' | 'custom-range' | 'all-time';

export interface InsightMessage {
  id: string;
  title: string;
  classification: 'prioridade_alta' | 'equilibrado' | 'negligenciado';
  messages: string[];
  customTitle?: string;
}

export interface PillarDataType {
  averages: {
    name: string;
    value: number;
    color: string;
    id: string;
  }[];
  highest: {
    name: string;
    value: number;
    color: string;
  } | null;
  lowest: {
    name: string;
    value: number;
    color: string;
  } | null;
  insights: InsightMessage[];
}

export interface FeedbackDistributionItem {
  name: string;
  value: number;
  percent: number;
  color: string;
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  avgTotal: number;
  avgConsequence: number;
  avgPride: number;
  avgConstruction: number;
  criticalCount: number;
  importantCount: number;
  moderateCount: number;
}
