import { useMemo } from 'react';
import { Task } from '@/types';

/**
 * Hook to handle task animation states based on visibility and other properties
 */
const useTaskAnimations = (task: Task) => {
  const animationState = useMemo(() => {
    // If the task has a specific animation state marker, use that
    if (task._animationState) {
      return task._animationState;
    }
    
    // Otherwise, determine based on hidden status
    return task.hidden ? 'hidden' : 'visible';
  }, [task._animationState, task.hidden]);
  
  // Calculate the animation class based on the animation state
  const animationClass = useMemo(() => {
    switch (animationState) {
      case 'hiding':
        return 'task-hiding';
      case 'showing':
        return 'task-showing';
      case 'hidden':
        return 'task-hidden';
      case 'visible':
      default:
        return 'task-visible';
    }
  }, [animationState]);
  
  // Determine if a visibility update is pending
  const isPendingVisibilityUpdate = useMemo(() => {
    return !!task._pendingVisibilityUpdate;
  }, [task._pendingVisibilityUpdate]);
  
  return {
    animationState,
    animationClass,
    isPendingVisibilityUpdate
  };
};

export default useTaskAnimations;
