import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // Reference date: May 16, 2024
    const refDate = new Date(2024, 4, 16); // Month is 0-indexed in JavaScript Date
    
    // For tasks that don't have a completedAt date (demo data), 
    // distribute them across the last 30 days
    return completed.map((task, index) => {
      // If task already has a valid completedAt date, use it
      if (task.completedAt) {
        return task;
      }
      
      // Otherwise, assign a fixed date for demo/testing purposes
      const daysAgo = index % 30;
      const completionDate = new Date(refDate);
      completionDate.setDate(refDate.getDate() - daysAgo);
      
      return {
        ...task,
        completedAt: completionDate.toISOString()
      };
    });
  }, [tasks]);

  return { completedTasks };
};
