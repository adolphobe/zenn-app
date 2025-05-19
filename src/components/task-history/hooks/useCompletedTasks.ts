
import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/context/auth';
import { fetchTasks } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';

export const useCompletedTasks = (initialTasks: Task[] = []) => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialTasks.filter(task => task.completed));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCompletedTasks = async () => {
      if (!currentUser?.id || !isAuthenticated) {
        // If user is not authenticated, just use local tasks
        setCompletedTasks(initialTasks.filter(task => task.completed));
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Fetch completed tasks from Supabase
        const tasksFromDB = await fetchTasks(currentUser.id, true);
        setCompletedTasks(tasksFromDB);
        setError(null);
      } catch (err) {
        console.error('Error loading completed tasks:', err);
        setError('Failed to load completed tasks. Please try again later.');
        toast({
          title: "Erro ao carregar tarefas",
          description: "Não foi possível carregar o histórico de tarefas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedTasks();
  }, [currentUser?.id, isAuthenticated, initialTasks]);

  return { 
    completedTasks, 
    isLoading, 
    error 
  };
};
