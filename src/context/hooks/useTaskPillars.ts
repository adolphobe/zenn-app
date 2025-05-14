
import { useCallback, useEffect } from 'react';
import { useAppState } from './useAppState';
import { useAppActions } from './useAppActions';
import { Task } from '@/types';

/**
 * Hook to manage task pillars based on scores
 */
export const useTaskPillars = () => {
  const { tasks } = useAppState();
  const { taskActions } = useAppActions();

  // Determine the dominant pillar for a task based on scores
  const getDominantPillar = useCallback((task: Task): string | null => {
    const { consequenceScore, prideScore, constructionScore } = task;
    
    // Find the highest score
    const maxScore = Math.max(consequenceScore, prideScore, constructionScore);
    
    // If all scores are equal, return null
    if (consequenceScore === prideScore && prideScore === constructionScore) {
      return "Balanceado";
    }
    
    // Return the pillar with the highest score
    if (maxScore === consequenceScore) return "Consequência";
    if (maxScore === prideScore) return "Orgulho";
    if (maxScore === constructionScore) return "Construção";
    
    return null;
  }, []);

  // Assign pillars to tasks that don't have them yet
  const assignMissingPillars = useCallback(() => {
    tasks.forEach(task => {
      if (!task.pillar) {
        const pillar = getDominantPillar(task);
        if (pillar) {
          taskActions.setPillar(task.id, pillar);
        }
      }
    });
  }, [tasks, taskActions, getDominantPillar]);

  // Update task pillars on component mount
  useEffect(() => {
    assignMissingPillars();
  }, [assignMissingPillars]);

  return {
    assignMissingPillars,
    getDominantPillar
  };
};

// Export the hook
export default useTaskPillars;
