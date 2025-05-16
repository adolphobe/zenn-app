
import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // For tasks that don't have feedback, assign them
    return completed.map((task, index) => {
      const updatedTask = { ...task };
      
      // Log task completion date for debugging
      console.log(`[useCompletedTasks] Task "${task.title}" completed at: ${task.completedAt}`);
      
      // If task doesn't have feedback (for demo data), assign one
      if (!updatedTask.feedback) {
        const feedbackOptions: ('transformed' | 'relief' | 'obligation')[] = [
          'transformed', 'relief', 'obligation'
        ];
        // Use modulo to cycle through the feedback options
        const feedbackIndex = index % feedbackOptions.length;
        updatedTask.feedback = feedbackOptions[feedbackIndex];
      }
      
      return updatedTask;
    });
  }, [tasks]);

  return { completedTasks };
};
