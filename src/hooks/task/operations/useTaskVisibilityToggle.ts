
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { toggleTaskHidden as toggleHiddenService } from '@/services/taskService';
import { useAuth } from '@/context/auth';
import { useTaskToasts } from '@/components/task/utils/taskToasts';

export const useTaskVisibilityToggle = (
  tasks: Task[],
  completed: boolean,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showToggleHiddenToast } = useTaskToasts();
  
  // Toggle hidden mutation with improved animation
  const toggleHiddenMutation = useMutation({
    mutationFn: (id: string) => {
      // Validate task exists
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
      return toggleHiddenService(id);
    },
    onMutate: async (id) => {
      // Set loading state
      setTaskOperationLoading(id, 'toggle-hidden', true);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', currentUser?.id, completed] });
      
      // Snapshot of the current data
      const previousTasks = queryClient.getQueryData(['tasks', currentUser?.id, completed]);
      
      // Get snapshot of the current task
      const task = tasks.find(t => t.id === id);
      if (!task) return { previousTasks };
      
      // Determine the new state
      const newHiddenState = !task.hidden;
      
      // Optimistically update to the new value with animation marker
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            return { 
              ...t, 
              hidden: newHiddenState,
              // Add animation markers
              _optimisticUpdateTime: Date.now(),
              _animationState: newHiddenState ? 'hiding' : 'showing',
              _pendingVisibilityUpdate: true
            };
          }
          return t;
        });
      });
      
      // Return context with original tasks for potential rollback
      return { 
        previousTasks,
        newHiddenState
      };
    },
    onSuccess: (result, id) => {
      // Get current task state before update
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const wasHidden = task?.hidden;
      const isNowHidden = result.hidden;
      
      // Show toast notification
      showToggleHiddenToast({...task, hidden: isNowHidden});
      
      // If the task was hidden, apply animation logic
      if (!wasHidden && isNowHidden) {
        // For tasks being hidden, add a small delay to allow 
        // the exit animation before removing from the list
        setTimeout(() => {
          // Update the cache after the exit animation
          queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
            if (!old) return [];
            
            return old.map(t => {
              if (t.id === id) {
                return { 
                  ...t, 
                  ...result,
                  _optimisticUpdateTime: t._optimisticUpdateTime || Date.now(),
                  _animationState: 'hidden',
                  _pendingVisibilityUpdate: false
                };
              }
              return t;
            });
          });
          
          // Invalidate queries to update the filters
          queryClient.invalidateQueries({ 
            queryKey: ['tasks', currentUser?.id, completed],
            exact: false
          });
        }, 400); // Time for exit animation
      } else {
        // For showing a hidden task, update immediately
        queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
          if (!old) return [];
          
          return old.map(t => {
            if (t.id === id) {
              return { 
                ...t, 
                ...result,
                _optimisticUpdateTime: t._optimisticUpdateTime || Date.now(),
                _animationState: 'visible',
                _pendingVisibilityUpdate: false
              };
            }
            return t;
          });
        });
        
        // Invalidate the query to update the filters and show the task
        queryClient.invalidateQueries({ 
          queryKey: ['tasks'],
          exact: false 
        });
      }
    },
    onError: (error: any, id, context) => {
      console.error('Error toggling task hidden status:', error);
      
      if (context?.previousTasks) {
        // Revert to the previous state on error
        queryClient.setQueryData(['tasks', currentUser?.id, completed], context.previousTasks);
      }
    },
    onSettled: (_, error, id) => {
      setTaskOperationLoading(id, 'toggle-hidden', false);
    }
  });
  
  return {
    toggleTaskHidden: (id: string) => toggleHiddenMutation.mutate(id),
    toggleHiddenLoading: toggleHiddenMutation.isPending
  };
};
