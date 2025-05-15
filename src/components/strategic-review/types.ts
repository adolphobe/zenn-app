
export type PeriodType = 'today' | 'week' | 'month' | 'custom';

export interface InsightMessage {
  id: string;
  title: string;
  classification: 'prioridade_alta' | 'equilibrado' | 'negligenciado';
  messages: string[];
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
