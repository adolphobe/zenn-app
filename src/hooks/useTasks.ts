import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/context/auth';
import { toast } from '@/hooks/use-toast';
import { 
  fetchTasks as fetchTasksFromDB
} from '@/services/task';

/**
 * Hook to manage task fetching and operations with Supabase integration
 */
export const useTasks = (completed: boolean = false) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAuthenticated } = useAuth();
  
  // Function to load tasks from the database
  const loadTasks = async () => {
    if (!currentUser?.id || !isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tasksData = await fetchTasksFromDB(currentUser.id, completed);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar suas tarefas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load tasks when user authentication state changes or completed filter changes
  useEffect(() => {
    loadTasks();
  }, [currentUser?.id, isAuthenticated, completed]);
  
  return {
    tasks,
    isLoading,
    error,
    refetch: loadTasks,
  };
};
