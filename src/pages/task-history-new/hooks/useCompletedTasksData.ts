
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { mapToTask } from '@/services/task/taskMapper';

interface TaskStatsType {
  count: number;
  highScoreCount: number;
  averageScore: number;
}

export const useCompletedTasksData = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { currentUser } = useAuth();
  
  // Fetch completed tasks for the current user
  const { 
    data: tasks = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['completedTasks', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          comments:task_comments(*)
        `)
        .eq('user_id', currentUser.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching completed tasks:', error);
        throw error;
      }
      
      return data.map(mapToTask);
    },
    enabled: !!currentUser?.id,
  });
  
  // Calculate stats for completed tasks
  const calculateStats = useCallback((): TaskStatsType => {
    if (!tasks || tasks.length === 0) {
      return {
        count: 0,
        highScoreCount: 0,
        averageScore: 0
      };
    }
    
    // Total task count
    const count = tasks.length;
    
    // High score tasks (tasks with score >= 12)
    const highScoreCount = tasks.filter(task => task.totalScore >= 12).length;
    
    // Average score of all tasks
    const totalScoreSum = tasks.reduce((sum, task) => sum + task.totalScore, 0);
    const averageScore = totalScoreSum / count;
    
    return {
      count,
      highScoreCount,
      averageScore
    };
  }, [tasks]);
  
  const stats = calculateStats();
  
  return {
    tasks,
    isLoading,
    stats,
    selectedTaskId,
    setSelectedTaskId,
    refetch
  };
};
