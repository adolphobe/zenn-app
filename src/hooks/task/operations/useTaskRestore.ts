
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreTask } from '@/services/taskService';
import { useAuth } from '@/context/auth';
import { Task } from '@/types';
import { useTaskToasts } from '@/components/task/utils/taskToasts';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';

export const useTaskRestore = (
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showRestoreToast } = useTaskToasts();
  
  // Restore task mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => {
      return restoreTask(id);
    },
    onMutate: async (id) => {
      // Set loading state
      setTaskOperationLoading(id, 'restore', true);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Get the current task from the cache (from completed tasks)
      const previousTasks = queryClient.getQueryData(['tasks', currentUser?.id, true]);
      const completedTask = queryClient.getQueryData<Task[]>(['tasks', currentUser?.id, true])?.find(t => t.id === id);
      
      if (!completedTask) {
        return { previousTasks };
      }
      
      // Log the task being restored
      logDateInfo('RESTORE_TASK', `Restoring task ${id}`, {
        before: {
          completed: completedTask.completed,
          completedAt: completedTask.completedAt
        }
      });
      
      // Remove the task from completed tasks (optimistic update)
      queryClient.setQueryData(['tasks', currentUser?.id, true], (old: Task[] | undefined) => {
        if (!old) return [];
        return old.filter(t => t.id !== id);
      });
      
      // Add the task to active tasks (optimistic update)
      queryClient.setQueryData(['tasks', currentUser?.id, false], (old: Task[] | undefined) => {
        if (!old) return [];
        
        // Create the restored task with cleared completion data and new ideal date
        const restoredTask = {
          ...completedTask,
          completed: false,
          completedAt: null,
          idealDate: new Date(),
          feedback: null
        };
        
        // Log the restored task
        logDateInfo('RESTORE_TASK', `Restored task ${id}`, {
          after: {
            completed: restoredTask.completed,
            completedAt: restoredTask.completedAt,
            idealDate: restoredTask.idealDate
          }
        });
        
        return [...old, restoredTask];
      });
      
      return { previousTasks };
    },
    onSuccess: (_, id) => {
      // Show success toast
      const taskTitle = queryClient.getQueryData<Task[]>(['tasks', currentUser?.id, false])?.find(t => t.id === id)?.title || 'Tarefa';
      showRestoreToast(taskTitle);
    },
    onError: (error, id, context) => {
      console.error('Error restoring task:', error);
      
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', currentUser?.id, true], context.previousTasks);
      }
    },
    onSettled: (_, __, id) => {
      setTaskOperationLoading(id, 'restore', false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  return {
    restoreTask: (id: string) => restoreMutation.mutate(id),
    restoreLoading: restoreMutation.isPending
  };
};
