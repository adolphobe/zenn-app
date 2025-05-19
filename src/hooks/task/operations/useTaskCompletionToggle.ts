
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { toggleTaskCompletion as toggleCompletionService } from '@/services/taskService';
import { useAuth } from '@/context/auth';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';

export const useTaskCompletionToggle = (
  tasks: Task[],
  completed: boolean,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  const toggleCompletionMutation = useMutation({
    mutationFn: (id: string) => {
      // Validate task exists
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
      logDiagnostics('TOGGLE_COMPLETION', `Toggling task completion for ${id}, current state: ${task.completed}`);
      logDateInfo('TOGGLE_COMPLETION', 'Current completedAt', task.completedAt);
      
      return toggleCompletionService(id, task.completed);
    },
    onMutate: (id) => {
      setTaskOperationLoading(id, 'toggle-complete', true);
      
      // Optimistic update
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            const newCompleted = !t.completed;
            const newCompletedAt = newCompleted ? new Date() : null;
            
            logDateInfo('TOGGLE_COMPLETION', 'Setting optimistic completedAt', newCompletedAt);
            
            return { 
              ...t, 
              completed: newCompleted,
              completedAt: newCompletedAt,
              _optimisticUpdateTime: Date.now()
            };
          }
          return t;
        });
      });
    },
    onSuccess: (updatedTask) => {
      // Log success for diagnosis
      logDiagnostics('TOGGLE_COMPLETION', 'Success, invalidating queries');
      logDateInfo('TOGGLE_COMPLETION', 'Updated task completedAt from success', updatedTask.completedAt);
      
      // Invalidate all task-related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any, id) => {
      console.error('Error toggling task completion:', error);
      
      // Log error for diagnosis
      logDiagnostics('TOGGLE_COMPLETION', `Error: ${error.message || 'Unknown error'}`);
      
      // Revert optimistic update
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            const task = tasks.find(originalTask => originalTask.id === id);
            
            logDateInfo('TOGGLE_COMPLETION', 'Reverting to original completedAt', task?.completedAt);
            
            return { 
              ...(task || t), 
              _optimisticUpdateTime: Date.now()
            };
          }
          return t;
        });
      });
      
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar o status da tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, id) => {
      setTaskOperationLoading(id, 'toggle-complete', false);
    }
  });
  
  return {
    toggleTaskCompleted: (id: string) => toggleCompletionMutation.mutate(id),
    toggleCompleteLoading: toggleCompletionMutation.isPending
  };
};
