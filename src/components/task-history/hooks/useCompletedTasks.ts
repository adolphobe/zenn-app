
import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/context/auth';
import { fetchTasks } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';

export const useCompletedTasks = (initialTasks: Task[] = []) => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCompletedTasks = async () => {
      if (!currentUser?.id || !isAuthenticated) {
        // If user is not authenticated, just use local tasks
        const validTasks = initialTasks
          .filter(task => task.completed)
          .map(task => {
            // Garantir que todas as tarefas têm datas válidas
            const completedAt = task.completedAt ? dateService.parseDate(task.completedAt) : null;
            
            return {
              ...task,
              completedAt: task.completed && !completedAt ? new Date() : completedAt
            };
          });
          
        setCompletedTasks(validTasks);
        setIsLoading(false);
        
        // Log some of the tasks for debugging
        if (validTasks.length > 0) {
          logDateInfo('useCompletedTasks', 'Usando tarefas locais completadas', {
            count: validTasks.length,
            firstTask: validTasks[0]
          });
        }
        
        return;
      }
      
      try {
        setIsLoading(true);
        // Fetch completed tasks from Supabase
        const tasksFromDB = await fetchTasks(currentUser.id, true);
        
        // Garantir que as datas estão no formato correto
        const processedTasks = tasksFromDB.map(task => {
          const completedAt = task.completedAt ? dateService.parseDate(task.completedAt) : null;
          
          // Log para diagnóstico
          logDateInfo('useCompletedTasks', `Task ${task.id} completedAt`, {
            original: task.completedAt,
            parsed: completedAt
          });
          
          return {
            ...task,
            // Se é uma tarefa concluída mas sem data, usa a data atual como fallback
            completedAt: task.completed && !completedAt ? new Date() : completedAt
          };
        });
        
        setCompletedTasks(processedTasks);
        setError(null);
        
        // Log para diagnóstico
        console.log(`Carregadas ${processedTasks.length} tarefas concluídas do banco de dados`);
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
