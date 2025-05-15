
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing which task is currently expanded
 */
export const useExpandedTask = () => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const toggleTaskExpanded = useCallback((taskId: string) => {
    setExpandedTaskId(prevId => prevId === taskId ? null : taskId);
  }, []);

  const isTaskExpanded = useCallback((taskId: string) => {
    return expandedTaskId === taskId;
  }, [expandedTaskId]);

  const collapseAllTasks = useCallback(() => {
    setExpandedTaskId(null);
  }, []);

  return {
    expandedTaskId,
    toggleTaskExpanded,
    isTaskExpanded,
    collapseAllTasks
  };
};
