
import { useState } from 'react';
import { Task } from '@/types';
import { useTaskCompletionToggle } from './operations/useTaskCompletionToggle';
import { useTaskVisibilityToggle } from './operations/useTaskVisibilityToggle';
import { useTaskFeedback } from './operations/useTaskFeedback';
import { useTaskRestore } from './operations/useTaskRestore';
import { logDiagnostics } from '@/utils/diagnosticLog';

export const useTaskStateOperations = (
  tasks: Task[],
  completed: boolean = false,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  // Logging for diagnosis
  logDiagnostics('useTaskStateOperations', `Initializing with ${tasks.length} tasks, completed filter: ${completed}`);
  
  // Task completion toggle mutation
  const { 
    toggleTaskCompleted, 
    toggleCompleteLoading 
  } = useTaskCompletionToggle(tasks, completed, setTaskOperationLoading);
  
  // Task visibility toggle mutation - Fix: Use the correct property name "toggleHiddenLoading"
  const { 
    toggleTaskHidden, 
    toggleHiddenLoading 
  } = useTaskVisibilityToggle(tasks, setTaskOperationLoading);
  
  // Task feedback mutation
  const { 
    setTaskFeedback, 
    setFeedbackLoading 
  } = useTaskFeedback(setTaskOperationLoading);
  
  // Task restore mutation - Fix: Pass only one argument as expected
  const { 
    restoreTask, 
    restoreLoading 
  } = useTaskRestore(setTaskOperationLoading);
  
  return {
    toggleTaskCompleted,
    toggleTaskHidden,
    setTaskFeedback,
    restoreTask,
    stateOperationsLoading: {
      toggleComplete: toggleCompleteLoading,
      toggleVisibility: toggleHiddenLoading,
      setFeedback: setFeedbackLoading,
      restore: restoreLoading
    }
  };
};
