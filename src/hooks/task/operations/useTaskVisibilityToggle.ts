
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { toggleTaskHidden } from '@/services/taskService';
import { useAuth } from '@/context/auth';
import { useTaskToasts } from '@/components/task/utils/taskToasts';

export const useTaskVisibilityToggle = (
  tasks: Task[],
  completed: boolean = false,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showToggleHiddenToast } = useTaskToasts();
  
  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: (id: string) => {
      // Get current task status
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
      return toggleTaskHidden(id);
    },
    onMutate: async (id) => {
      // Set loading state
      setTaskOperationLoading(id, 'toggle-hidden', true);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', currentUser?.id, completed] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', currentUser?.id, completed]);
      
      // Get the task for optimistic update
      const task = tasks.find(t => t.id === id);
      
      if (task) {
        // Optimistically update to the new value
        queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
          if (!old) return [];
          return old.map(t => {
            if (t.id === id) {
              return { ...t, hidden: !t.hidden };
            }
            return t;
          });
        });
      }
      
      return { previousTasks };
    },
    onSuccess: (updatedTask, id) => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        showToggleHiddenToast({ ...task, hidden: !task.hidden });
      }
      queryClient.invalidateQueries({ 
        queryKey: ['tasks'],
        exact: false
      });
    },
    onError: (error, id, context) => {
      console.error('Error toggling task visibility:', error);
      
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', currentUser?.id, completed], context.previousTasks);
      }
    },
    onSettled: (_, error, id) => {
      setTaskOperationLoading(id, 'toggle-hidden', false);
    }
  });
  
  return {
    toggleTaskHidden: (id: string) => toggleVisibilityMutation.mutate(id),
    toggleHiddenLoading: toggleVisibilityMutation.isPending
  };
};
