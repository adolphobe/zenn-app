import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import {
  toggleTaskCompletion as toggleCompletionService,
  toggleTaskHidden as toggleHiddenService,
  setTaskFeedback as setFeedbackService,
  restoreTask as restoreTaskService
} from '@/services/taskService';
import { useAuth } from '@/context/auth';

export const useTaskStateOperations = (
  tasks: Task[],
  completed: boolean = false,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Toggle completion mutation
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
  
  // Toggle hidden mutation com animação de saída melhorada
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
      
      const newHiddenState = !task.hidden;
      
      // Optimistically update to the new value
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            return { 
              ...t, 
              hidden: newHiddenState,
              // Add a timestamp to ensure the animation detects the change
              _optimisticUpdateTime: Date.now(),
              _pendingHiddenUpdate: true // Marcador para animação de saída
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
      const task = tasks.find(t => t.id === id);
      const wasHidden = task?.hidden;
      const isNowHidden = result.hidden;
      
      // Se a tarefa vai ser ocultada, aplicamos um pequeno delay para permitir a animação de saída
      if (!wasHidden && isNowHidden) {
        setTimeout(() => {
          // Depois que a animação de saída terminar, atualizamos o cache
          queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
            if (!old) return [];
            
            // A tarefa que acabou de ser ocultada não é mais filtrada aqui, pois queremos
            // que ela seja removida da visualização ao ser ocultada, a menos que o filtro
            // de tarefas ocultas esteja ativado
            return old.map(t => {
              if (t.id === id) {
                return { 
                  ...t, 
                  ...result,
                  // Manter a marca de timestamp para animação
                  _optimisticUpdateTime: t._optimisticUpdateTime || Date.now(),
                  _pendingHiddenUpdate: false
                };
              }
              return t;
            });
          });
          
          // Invalidar a query para atualizar os filtros de visibilidade
          queryClient.invalidateQueries({ 
            queryKey: ['tasks', currentUser?.id, completed],
            exact: true
          });
        }, 300); // Tempo para animação de saída
      } else {
        // Para mostrar uma tarefa, atualizamos imediatamente
        queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
          if (!old) return [];
          
          return old.map(t => {
            if (t.id === id) {
              return { 
                ...t, 
                ...result,
                // Manter a marca de timestamp para animação
                _optimisticUpdateTime: t._optimisticUpdateTime || Date.now(),
                _pendingHiddenUpdate: false
              };
            }
            return t;
          });
        });
        
        // Invalidar a query para atualizar os filtros de visibilidade
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', currentUser?.id, completed],
          exact: true
        });
      }
      
      // Adicionar feedback visual imediato
      toast({
        id: `toggle-hidden-${id}-${Date.now()}`,
        title: isNowHidden ? "Tarefa oculta" : "Tarefa visível",
        description: isNowHidden 
          ? "A tarefa foi ocultada e só será visível com o filtro ativado." 
          : "A tarefa agora está visível.",
      });
    },
    onError: (error: any, id, context) => {
      console.error('Error toggling task hidden status:', error);
      
      if (context?.previousTasks) {
        // Revert to the previous state on error
        queryClient.setQueryData(['tasks', currentUser?.id, completed], context.previousTasks);
      }
      
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar visibilidade",
        description: "Não foi possível atualizar a visibilidade da tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, error, id) => {
      setTaskOperationLoading(id, 'toggle-hidden', false);
    }
  });
  
  // Set feedback mutation
  const setFeedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string, feedback: 'transformed' | 'relief' | 'obligation' }) => {
      return setFeedbackService(id, feedback);
    },
    onMutate: ({ id }) => {
      setTaskOperationLoading(id, 'set-feedback', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('Error setting task feedback:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar feedback",
        description: "Não foi possível salvar o feedback. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, { id }) => {
      setTaskOperationLoading(id, 'set-feedback', false);
    }
  });
  
  // Restore task mutation
  const restoreTaskMutation = useMutation({
    mutationFn: (id: string) => {
      return restoreTaskService(id);
    },
    onMutate: (id) => {
      setTaskOperationLoading(id, 'restore', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        id: uuidv4(),
        title: "Tarefa restaurada",
        description: "A tarefa foi restaurada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Error restoring task:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao restaurar tarefa",
        description: "Não foi possível restaurar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, id) => {
      setTaskOperationLoading(id, 'restore', false);
    }
  });
  
  return {
    toggleTaskCompleted: (id: string) => toggleCompletionMutation.mutate(id),
    toggleTaskHidden: (id: string) => toggleHiddenMutation.mutate(id),
    setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => 
      setFeedbackMutation.mutate({ id, feedback }),
    restoreTask: (id: string) => restoreTaskMutation.mutate(id),
    stateOperationsLoading: {
      toggleComplete: toggleCompletionMutation.isPending,
      toggleHidden: toggleHiddenMutation.isPending,
      setFeedback: setFeedbackMutation.isPending,
      restore: restoreTaskMutation.isPending
    }
  };
};
