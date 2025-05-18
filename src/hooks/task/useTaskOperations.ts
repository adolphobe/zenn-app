import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  toggleTaskCompletion as toggleCompletionService,
  toggleTaskHidden as toggleHiddenService,
  setTaskFeedback as setFeedbackService,
  restoreTask as restoreTaskService
} from '@/services/taskService';
import { useAuth } from '@/context/auth';

export const useTaskOperations = (completed: boolean = false) => {
  const { currentUser } = useAuth();
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
  
  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (task: TaskFormData) => {
      if (!currentUser?.id) {
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
      return updateTaskService(id, data);
    },
    onMutate: ({ id }) => {
      setTaskOperationLoading(id, 'update', true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
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
  
  // Delete task mutation with optimistic updates
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteTaskService(id);
    },
    onMutate: async (id) => {
      setTaskOperationLoading(id, 'delete', true);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', { completed }]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['tasks', { completed }], (old: Task[] = []) => {
        return old.filter(task => task.id !== id);
      });
      
      return { previousTasks };
    },
    onSuccess: () => {
      toast({
        id: uuidv4(),
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso."
      });
    },
    onError: (error: any, id, context) => {
      console.error('Error deleting task:', error);
      
      // Restore previous state if something went wrong
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', { completed }], context.previousTasks);
      }
      
      toast({
        id: uuidv4(),
        title: "Erro ao excluir tarefa",
        description: "Não foi possível excluir a tarefa. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, id) => {
      setTaskOperationLoading(id, 'delete', false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  return {
    addTask: (task: TaskFormData) => addTaskMutation.mutate(task),
    updateTask: (id: string, data: Partial<TaskFormData>) => updateTaskMutation.mutate({ id, data }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
    operationLoading,
    setTaskOperationLoading,
    operationsLoading: {
      add: addTaskMutation.isPending,
      update: updateTaskMutation.isPending,
      delete: deleteTaskMutation.isPending
    }
  };
};
