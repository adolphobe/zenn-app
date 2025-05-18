
import { useState, useEffect } from 'react';
import { InsightMessage } from '@/components/strategic-review/types';

export const usePillarHover = (insights: InsightMessage[] = [], defaultPillarId: string = 'consequence') => {
  const [activeInsightId, setActiveInsightId] = useState<string>(defaultPillarId);
  
  // Reset to default when insights change or are empty
  useEffect(() => {
    if (!insights || insights.length === 0) {
      return;
    }
    
    // If the current activeInsightId is not in the insights, reset to default
    const insightExists = insights.some(insight => insight.id === activeInsightId);
    if (!insightExists) {
      setActiveInsightId(defaultPillarId);
    }
  }, [insights, activeInsightId, defaultPillarId]);
  
  const handlePillarHover = (pillarId: string) => {
    if (!pillarId) return;
    setActiveInsightId(pillarId);
  };
  
  // Find the active insight, or fallback to first insight, or return null if no insights
  const activeInsight = insights && insights.length > 0
    ? insights.find(insight => insight.id === activeInsightId) || insights[0]
    : null;
  
  return {
    activeInsightId,
    activeInsight,
    handlePillarHover
  };
};
