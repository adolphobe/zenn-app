
import { Task } from '@/types';
import { useTaskCompletionToggle } from './operations/useTaskCompletionToggle';
import { useTaskVisibilityToggle } from './operations/useTaskVisibilityToggle';
import { useTaskFeedback } from './operations/useTaskFeedback';
import { useTaskRestore } from './operations/useTaskRestore';

export const useTaskStateOperations = (
  tasks: Task[],
  completed: boolean = false,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  // Usar hooks especializados para cada operação
  const completionToggle = useTaskCompletionToggle(tasks, completed, setTaskOperationLoading);
  const visibilityToggle = useTaskVisibilityToggle(tasks, completed, setTaskOperationLoading);
  const feedbackOperations = useTaskFeedback(setTaskOperationLoading);
  const restoreOperations = useTaskRestore(setTaskOperationLoading);
  
  return {
    // Exportar todas as operações dos hooks
    toggleTaskCompleted: completionToggle.toggleTaskCompleted,
    toggleTaskHidden: visibilityToggle.toggleTaskHidden,
    setTaskFeedback: feedbackOperations.setTaskFeedback,
    restoreTask: restoreOperations.restoreTask,
    
    // Combinar os estados de carregamento
    stateOperationsLoading: {
      toggleComplete: completionToggle.toggleCompleteLoading,
      toggleHidden: visibilityToggle.toggleHiddenLoading,
      setFeedback: feedbackOperations.setFeedbackLoading,
      restore: restoreOperations.restoreLoading
    }
  };
};
