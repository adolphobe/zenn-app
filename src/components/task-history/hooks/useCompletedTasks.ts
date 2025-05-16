
import { useMemo } from 'react';
import { Task } from '@/types';

export const useCompletedTasks = (tasks: Task[]) => {
  const completedTasks = useMemo(() => {
    // Get all completed tasks
    const completed = tasks.filter(task => task.completed) as Task[];
    
    // For tasks that don't have completedAt or feedback, assign them
    return completed.map((task, index) => {
      const updatedTask = { ...task };
      
      // If task doesn't have a completedAt date (shouldn't happen with our fixes now)
      // This is just a fallback for any unexpected cases
      if (!updatedTask.completedAt) {
        const now = new Date();
        // Generate a reasonable time in the past using the index
        const daysAgo = index % 60; // Distribute over the last 60 days
        const hours = Math.floor(Math.random() * 13) + 8; // 8 AM to 8 PM
        const minutes = Math.floor(Math.random() * 60);
        
        const completionDate = new Date();
        completionDate.setDate(now.getDate() - daysAgo);
        completionDate.setHours(hours, minutes);
        
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
