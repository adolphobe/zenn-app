
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
  const getDominantPillar = useCallback((task: Task): string => {
    const { consequenceScore, prideScore, constructionScore } = task;
    
    // Find the highest score
    const maxScore = Math.max(consequenceScore, prideScore, constructionScore);
    
    // If all scores are equal or very close (within 0.5), return "Balanceado"
    if (
      Math.abs(consequenceScore - prideScore) <= 0.5 && 
      Math.abs(prideScore - constructionScore) <= 0.5 &&
      Math.abs(consequenceScore - constructionScore) <= 0.5
    ) {
      return "Balanceado";
    }
    
    // Return the pillar with the highest score
    if (maxScore === consequenceScore) return "Consequência";
    if (maxScore === prideScore) return "Orgulho";
    if (maxScore === constructionScore) return "Construção";
    
    // Default fallback - should never reach here
    return "Balanceado";
  }, []);

  // Assign pillars to tasks that don't have them yet or where pillar doesn't match scores
  const assignMissingPillars = useCallback(() => {
    tasks.forEach(task => {
      // Get the dominant pillar based on current scores
      const dominantPillar = getDominantPillar(task);
      
      // If task has no pillar or incorrect pillar, update it
      if (!task.pillar || task.pillar !== dominantPillar) {
        taskActions.setPillar(task.id, dominantPillar);
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
