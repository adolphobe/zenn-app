
import { useState } from 'react';
import { InsightMessage } from '@/components/strategic-review/types';

export const usePillarHover = (insights: InsightMessage[], defaultPillarId: string = 'consequence') => {
  const [activeInsightId, setActiveInsightId] = useState<string>(defaultPillarId);
  
  const handlePillarHover = (pillarId: string) => {
    setActiveInsightId(pillarId);
  };
  
  const activeInsight = insights.find(insight => insight.id === activeInsightId) || insights[0];
  
  return {
    activeInsightId,
    activeInsight,
    handlePillarHover
  };
};
