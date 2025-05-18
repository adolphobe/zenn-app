
import { useEffect, useState } from 'react';
import { Task } from '@/types';

export const useTaskAnimations = (task: Task) => {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    // Update animation class based on task state
    const isPendingVisibilityUpdate = task._pendingVisibilityUpdate || false;
    const animationState = task._animationState || (task.hidden ? 'hidden' : 'visible');
    
    if (isPendingVisibilityUpdate) {
      setAnimationClass(animationState === 'hiding' ? 'animate-fade-out' : 'animate-fade-in');
    } else {
      setAnimationClass('');
    }
  }, [task._pendingVisibilityUpdate, task._animationState, task.hidden]);
  
  return { 
    animationClass,
    isPendingVisibilityUpdate: task._pendingVisibilityUpdate || false,
    animationState: task._animationState || (task.hidden ? 'hidden' : 'visible')
  };
};

export default useTaskAnimations;
