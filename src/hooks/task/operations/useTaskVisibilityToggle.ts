
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { toggleTaskHidden as toggleHiddenService } from '@/services/taskService';
import { useAuth } from '@/context/auth';

export const useTaskVisibilityToggle = (
  tasks: Task[],
  completed: boolean,
  setTaskOperationLoading: (taskId: string, operation: string, loading: boolean) => void
) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Toggle hidden mutation com animação melhorada
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
      
      // Determinar o novo estado
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
      const wasHidden = task?.hidden;
      const isNowHidden = result.hidden;
      
      // Se a tarefa foi ocultada, aplicamos a lógica de animação
      if (!wasHidden && isNowHidden) {
        // Para tarefas sendo ocultadas, adicionamos um pequeno delay para permitir 
        // a animação de saída antes de remover da lista
        setTimeout(() => {
          // Atualizar a cache depois da animação de saída
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
          
          // Invalidar queries para atualizar os filtros
          queryClient.invalidateQueries({ 
            queryKey: ['tasks', currentUser?.id, completed],
            exact: false
          });
        }, 400); // Tempo para animação de saída
      } else {
        // Para mostrar uma tarefa oculta, atualizamos imediatamente
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
        
        // Invalidar a query para atualizar os filtros e mostrar a tarefa
        queryClient.invalidateQueries({ 
          queryKey: ['tasks'],
          exact: false 
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
  
  return {
    toggleTaskHidden: (id: string) => toggleHiddenMutation.mutate(id),
    toggleHiddenLoading: toggleHiddenMutation.isPending
  };
};
