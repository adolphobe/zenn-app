
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { restoreTask as restoreTaskService } from '@/services/taskService';
import { useAuth } from '@/context/auth';
import { logDiagnostics } from '@/utils/diagnosticLog';

export const useTaskRestore = (
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Restore task mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => {
      logDiagnostics('RESTORE_TASK', `Restoring task ${id}`);
      return restoreTaskService(id);
    },
    onMutate: async (id) => {
      // Set loading state
      setTaskOperationLoading(id, 'restore', true);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Get snapshot of the previous tasks
      const previousTasks = queryClient.getQueryData(['tasks', currentUser?.id, true]);
      
      // Return context for potential rollback
      return { previousTasks };
    },
    onSuccess: (_, id) => {
      logDiagnostics('RESTORE_TASK', `Task ${id} successfully restored, invalidating queries`);
      
      // Invalidate all task queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['tasks'],
        exact: false 
      });
    },
    onError: (error, id, context) => {
      console.error('Error restoring task:', error);
      
      if (context?.previousTasks) {
        // Revert to the previous state on error
        queryClient.setQueryData(['tasks', currentUser?.id, true], context.previousTasks);
      }
    },
    onSettled: (_, error, id) => {
      // Always clear loading state
      setTaskOperationLoading(id, 'restore', false);
    }
  });
  
  return {
    restoreTask: (id: string) => restoreMutation.mutate(id),
    restoreLoading: restoreMutation.isPending
  };
};
