
import { useState } from 'react';
import { InsightMessage } from '@/components/strategic-review/types';

export const usePillarHover = (insights: InsightMessage[], defaultPillarId: string = 'consequence') => {
  const [activeInsightId, setActiveInsightId] = useState<string>(defaultPillarId);
  
  const handlePillarHover = (pillarId: string) => {
    setActiveInsightId(pillarId);
  };
  
  // Safely find the active insight or return undefined
  const activeInsight = insights && insights.length > 0 
    ? insights.find(insight => insight.id === activeInsightId) || insights[0]
    : undefined;
  
  return {
    activeInsightId,
    activeInsight,
    handlePillarHover
  };
};
