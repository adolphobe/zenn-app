
export type PeriodType = 'today' | 'week' | 'month' | 'custom';

export interface InsightMessage {
  title: string;
  messages: string[];
}

export interface PillarDataType {
  averages: {
    name: string;
    value: number;
    color: string;
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
