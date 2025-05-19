export type PeriodType = 'today' | 'yesterday' | 'week' | 'month' | 'custom' | 'custom-range' | 'all-time';

export interface InsightMessage {
  id: string;
  title: string;
  classification: 'prioridade_alta' | 'equilibrado' | 'negligenciado';
  messages: string[];
  customTitle?: string; // Adicionando o campo customTitle
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
