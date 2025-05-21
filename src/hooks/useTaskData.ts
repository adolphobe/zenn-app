
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Task, TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/auth';
import { useFetchTasks } from './task/useFetchTasks';
import { useTaskOperations } from './task/useTaskOperations';
import { useTaskStateOperations } from './task/useTaskStateOperations';

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
  
  // Fetch tasks using the dedicated hook
  const { 
    tasks, 
    isLoading, 
    error, 
    forceSynchronize, 
    syncStatus 
  } = useFetchTasks(completed);
  
  // Basic task operations (create, update, delete)
  const taskOperations = useTaskOperations(completed);
  
  // State-changing task operations (complete, hide, feedback)
  const taskStateOperations = useTaskStateOperations(
    tasks, 
    completed, 
    setTaskOperationLoading
  );
  
  // Get enhanced tasks with operation loading states
  const enhancedTasks = tasks.map(task => ({
    ...task,
    operationLoading: operationLoading[task.id] || {}
  }));
  
  // Force manual synchronization
  const synchronizeTasks = async () => {
    if (!currentUser?.id || !isAuthenticated) {
      toast({
        id: uuidv4(),
        title: "Não autenticado",
        description: "Você precisa estar autenticado para sincronizar tarefas.",
        variant: "destructive",
      });
      return;
    }
    
    return forceSynchronize();
  };
  
  return {
    tasks: enhancedTasks,
    isLoading,
    error,
    syncStatus,
    // Export all operations from both hooks
    ...taskOperations,
    ...taskStateOperations,
    forceSynchronize: synchronizeTasks,
    // Combine loading states
    operationsLoading: {
      ...taskOperations.operationsLoading,
      ...taskStateOperations.stateOperationsLoading
    }
  };
};
