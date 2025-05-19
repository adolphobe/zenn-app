
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TaskHistoryStatsProps {
  filteredTasks: Task[];
}

export const TaskHistoryStats: React.FC<TaskHistoryStatsProps> = ({ filteredTasks }) => {
  // Calculate average score with proper error handling
  const averageScore = useMemo(() => {
    try {
      if (!filteredTasks || filteredTasks.length === 0) return '0';
      
      // Calculate total score with null/undefined check
      const validScores = filteredTasks.filter(task => typeof task.totalScore === 'number');
      
      if (validScores.length === 0) return '0';
      
      const totalScore = validScores.reduce((sum, task) => sum + (task.totalScore || 0), 0);
      return (totalScore / validScores.length).toFixed(1);
    } catch (err) {
      console.error('Error calculating average score:', err);
      return '0';
    }
  }, [filteredTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Total concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{filteredTasks?.length || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Média de pontuação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageScore}</div>
        </CardContent>
      </Card>
    </div>
  );
};
