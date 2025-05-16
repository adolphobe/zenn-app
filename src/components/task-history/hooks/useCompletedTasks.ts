
import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // For tasks that don't have completedAt or feedback, assign them
    return completed.map((task, index) => {
      const updatedTask = { ...task };
      
      // If task doesn't have a completedAt date (for demo data)
      if (!updatedTask.completedAt) {
        // For demo data, create dates in the past
        // But for newly completed tasks, the completedAt should already be set
        // by the toggleTaskCompleted action
        const now = new Date();
        const daysAgo = index % 30; // Distribute over the last 30 days
        const completionDate = new Date();
        completionDate.setDate(now.getDate() - daysAgo);
        updatedTask.completedAt = completionDate.toISOString();
      }
      
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
