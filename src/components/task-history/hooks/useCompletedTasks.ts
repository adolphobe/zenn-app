
import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  // Modified to assign fixed dates to completed tasks
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // Reference date: May 16, 2024
    const refDate = new Date(2024, 4, 16); // Month is 0-indexed in JavaScript Date
    
    // Assign fixed dates within the last 30 days before refDate
    return completed.map((task, index) => {
      // Distribute tasks across the last 30 days
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
