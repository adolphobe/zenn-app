
import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // Apenas registramos as tarefas concluídas no console para depuração
    completed.forEach(task => {
      console.log(`[useCompletedTasks] Task "${task.title}" completed at: ${task.completedAt}`);
    });
    
    // Retorna as tarefas sem modificá-las - importante para manter as datas originais
    return completed;
  }, [tasks]);

  return { completedTasks };
};
