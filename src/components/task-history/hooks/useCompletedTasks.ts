
import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // Reference date: May 16, 2024
    const refDate = new Date(2024, 4, 16); // Month is 0-indexed in JavaScript Date
    
    // Available feedback options for demo tasks
    const feedbackOptions: ('transformed' | 'relief' | 'obligation')[] = [
      'transformed', 'relief', 'obligation'
    ];
    
    // For tasks that don't have completedAt or feedback, assign them
    return completed.map((task, index) => {
      const updatedTask = { ...task };
      
      // If task doesn't have a completedAt date (demo data), assign one
      if (!updatedTask.completedAt) {
        const daysAgo = index % 30;
        const completionDate = new Date(refDate);
        completionDate.setDate(refDate.getDate() - daysAgo);
        updatedTask.completedAt = completionDate.toISOString();
      }
      
      // If task doesn't have feedback, assign one (for demo data)
      if (!updatedTask.feedback) {
        // Use modulo to cycle through the feedback options
        const feedbackIndex = index % feedbackOptions.length;
        updatedTask.feedback = feedbackOptions[feedbackIndex];
      }
      
      return updatedTask;
    });
  }, [tasks]);

  return { completedTasks };
};
