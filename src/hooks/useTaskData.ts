
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  fetchTasks,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  toggleTaskCompletion as toggleCompletionService,
  toggleTaskHidden as toggleHiddenService,
  setTaskFeedback as setFeedbackService,
  restoreTask as restoreTaskService
} from '@/services/taskService';
import { useAuth } from '@/context/auth';

/**
 * A hook to manage task data with React Query, providing proper caching and synchronization
 */
export const useTaskData = (completed: boolean = false) => {
  const { currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [operationLoading, setOperationLoading] = useState<Record<string, Record<string, boolean>>>({});
  
  // Helper to set loading state for specific task operations
  const setTaskOperationLoading = (taskId: string, operation: string, loading: boolean) => {
    setOperationLoading(prev => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [operation]: loading
      }
    }));
  };

  // Main query for fetching tasks with proper caching
  const { 
    data: tasks = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['tasks', currentUser?.id, completed],
    queryFn: () => currentUser?.id ? fetchTasks(currentUser.id, completed) : Promise.resolve([]),
    enabled: !!currentUser?.id && isAuthenticated,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true
  });
  
  // Get enhanced tasks with operation loading states
  const enhancedTasks = tasks.map(task => ({
    ...task,
    operationLoading: operationLoading[task.id] || {}
  }));
  
  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (task: TaskFormData) => {
      if (!currentUser?.id || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      return createTaskService(task, currentUser.id);
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        id: uuidv4(),
        title: "Tarefa adicionada",
        description: `"${newTask.title}" foi adicionada com sucesso.`
      });
    },
    onError: (error: any) => {
      console.error('Error adding task:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar tarefa",
        description: "Não foi possível adicionar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TaskFormData> }) => {
      // Validate task exists
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
      return updateTaskService(id, data);
    },
    onMutate: ({ id }) => {
      setTaskOperationLoading(id, 'update', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any, { id }) => {
      console.error('Error updating task:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, { id }) => {
      setTaskOperationLoading(id, 'update', false);
    }
  });
  
  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => {
      // Validate task exists
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
      return deleteTaskService(id);
    },
    onMutate: (id) => {
      setTaskOperationLoading(id, 'delete', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        id: uuidv4(),
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Error deleting task:', error);
      toast({
        id: uuidv4(),
        title: "Erro ao excluir tarefa",
        description: "Não foi possível excluir a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  });
  
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('Error toggling task completion:', error);
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
  
  // Toggle hidden mutation - Improved optimistic updates
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
      
      // Get current task
      const task = tasks.find(t => t.id === id);
      if (!task) return { previousTasks: tasks };
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', currentUser?.id, completed]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['tasks', currentUser?.id, completed], (old: Task[] | undefined) => {
        if (!old) return [];
        
        return old.map(t => {
          if (t.id === id) {
            // Log the visual update
            console.log(`Atualizando visualmente tarefa ${id}. Visibilidade atual: ${t.hidden}, Nova: ${!t.hidden}`);
            return { ...t, hidden: !t.hidden };
          }
          return t;
        });
      });
      
      // Immediately show visual feedback
      toast({
        id: uuidv4(),
        title: task.hidden ? "Tarefa visível" : "Tarefa oculta",
        description: task.hidden ? "A tarefa agora está visível." : "A tarefa foi ocultada.",
      });
      
      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (error: any, id, context) => {
      console.error('Error toggling task hidden status:', error);
      
      // Revert back to previous state if there's an error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', currentUser?.id, completed], context.previousTasks);
      }
      
      toast({
        id: uuidv4(),
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a visibilidade da tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, id) => {
      setTaskOperationLoading(id, 'toggle-hidden', false);
      // Delay invalidation slightly to ensure UI has time to animate
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['tasks', currentUser?.id, completed] });
      }, 300);
    }
  });
  
  // Set feedback mutation
  const setFeedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string, feedback: 'transformed' | 'relief' | 'obligation' }) => {
      // Validate task exists
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
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
      // Validate task exists
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      
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
  
  // Force manual synchronization
  const forceSynchronize = async () => {
    if (!currentUser?.id || !isAuthenticated) {
      toast({
        id: uuidv4(),
        title: "Não autenticado",
        description: "Você precisa estar autenticado para sincronizar tarefas.",
        variant: "destructive",
      });
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    return refetch();
  };
  
  return {
    tasks: enhancedTasks,
    isLoading,
    error,
    addTask: (task: TaskFormData) => addTaskMutation.mutate(task),
    updateTask: (id: string, data: Partial<TaskFormData>) => updateTaskMutation.mutate({ id, data }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
    toggleTaskCompleted: (id: string) => toggleCompletionMutation.mutate(id),
    toggleTaskHidden: (id: string) => toggleHiddenMutation.mutate(id),
    setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => 
      setFeedbackMutation.mutate({ id, feedback }),
    restoreTask: (id: string) => restoreTaskMutation.mutate(id),
    forceSynchronize,
    operationsLoading: {
      add: addTaskMutation.isPending,
      update: updateTaskMutation.isPending,
      delete: deleteTaskMutation.isPending,
      toggleComplete: toggleCompletionMutation.isPending,
      toggleHidden: toggleHiddenMutation.isPending,
      setFeedback: setFeedbackMutation.isPending,
      restore: restoreTaskMutation.isPending,
    }
  };
};
