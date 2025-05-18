
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { toggleTaskCompletion as toggleCompletionService } from '@/services/taskService';
import { useAuth } from '@/context/auth';

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
      
      return toggleCompletionService(id, task.completed);
    },
    onMutate: (id) => {
      setTaskOperationLoading(id, 'toggle-complete', true);
      
      // Optimistic update
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            return { 
              ...t, 
              completed: !t.completed,
              _optimisticUpdateTime: Date.now()
            };
          }
          return t;
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any, id) => {
      console.error('Error toggling task completion:', error);
      
      // Revert optimistic update
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            return { 
              ...t, 
              completed: !t.completed,
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
