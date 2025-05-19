import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { toggleTaskCompletion } from '@/services/taskService';
import { useAuth } from '@/context/auth';
import { useTaskToasts } from '@/components/task/utils/taskToasts';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';

export const useTaskCompletionToggle = (
  tasks: Task[],
  completed: boolean,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showCompletionToast } = useTaskToasts(); // Using the renamed function
  
  // Toggle completion mutation
  const toggleCompletionMutation = useMutation({
    mutationFn: (id: string) => {
      // Get current task status for logging
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
      logDiagnostics('TOGGLE_COMPLETION', `Toggling task ${id} completion, current status: ${task.completed}`);
      
      // If completing, log exact completion time we're using
      if (!task.completed) {
        const nowDate = new Date();
        logDateInfo('TOGGLE_COMPLETION', `Setting completedAt for task ${id}`, nowDate);
      }
      
      return toggleTaskCompletion(id, task.completed);
    },
    onMutate: async (id) => {
      // Set loading state
      setTaskOperationLoading(id, 'toggle-complete', true);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', currentUser?.id, completed] });
      
      // Snapshot of the current data
      const previousTasks = queryClient.getQueryData(['tasks', currentUser?.id, completed]);
      
      // Get task data for optimistic update
      const task = tasks.find(t => t.id === id);
      if (!task) return { previousTasks };
      
      // Optimistically update to the new value with exact timestamp
      const newCompletedState = !task.completed;
      const nowIso = new Date().toISOString();
      
      logDiagnostics('TOGGLE_COMPLETION', `Optimistic update for task ${id}`, {
        newCompletedState,
        completedAt: newCompletedState ? nowIso : null
      });
      
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            return { 
              ...t, 
              completed: newCompletedState,
              completedAt: newCompletedState ? nowIso : null
            };
          }
          return t;
        });
      });
      
      // Return context with original tasks for potential rollback
      return { previousTasks };
    },
    onSuccess: (updatedTask, id) => {
      const task = tasks.find(t => t.id === id);
      
      if (task) {
        logDateInfo('TOGGLE_COMPLETION', `Success response for task ${id} completedAt`, updatedTask.completedAt);
        
        // Show toast notification
        showCompletionToast(updatedTask);
      }
      
      // Invalidate queries to refresh cache with server data
      queryClient.invalidateQueries({ 
        queryKey: ['tasks'],
        exact: false 
      });
    },
    onError: (error, id, context) => {
      console.error('Error toggling task completion:', error);
      
      if (context?.previousTasks) {
        // Revert to the previous state on error
        queryClient.setQueryData(['tasks', currentUser?.id, completed], context.previousTasks);
      }
    },
    onSettled: (_, error, id) => {
      // Always clear loading state
      setTaskOperationLoading(id, 'toggle-complete', false);
    }
  });
  
  return {
    toggleTaskCompleted: (id: string) => toggleCompletionMutation.mutate(id),
    toggleCompleteLoading: toggleCompletionMutation.isPending
  };
};
