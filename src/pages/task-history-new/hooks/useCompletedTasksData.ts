
import { useState, useMemo } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Task } from '@/types';

/**
 * Hook to manage completed tasks data for the new task history page
 */
export const useCompletedTasksData = () => {
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Basic stats about completed tasks
  const stats = useMemo(() => {
    if (!completedTasks || completedTasks.length === 0) {
      return {
        count: 0,
        highScoreCount: 0,
        averageScore: 0
      };
    }
    
    const tasksWithScores = completedTasks.filter(task => 
      task.totalScore !== undefined && task.totalScore !== null
    );
    
    const highScoreCount = tasksWithScores.filter(task => 
      (task.totalScore || 0) >= 12
    ).length;
    
    const totalScore = tasksWithScores.reduce((sum, task) => 
      sum + (task.totalScore || 0), 0
    );
    
    const averageScore = tasksWithScores.length > 0 
      ? Math.round((totalScore / tasksWithScores.length) * 10) / 10
      : 0;
    
    return {
      count: completedTasks.length,
      highScoreCount,
      averageScore
    };
  }, [completedTasks]);
  
  // Get the selected task
  const selectedTask = useMemo(() => {
    if (!selectedTaskId || !completedTasks) return null;
    return completedTasks.find(task => task.id === selectedTaskId) || null;
  }, [selectedTaskId, completedTasks]);
  
  return {
    tasks: completedTasks || [],
    isLoading: completedTasksLoading,
    stats,
    selectedTaskId,
    setSelectedTaskId,
    selectedTask
  };
};
