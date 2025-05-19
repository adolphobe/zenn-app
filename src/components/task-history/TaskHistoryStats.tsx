
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TaskHistoryStatsProps {
  filteredTasks: Task[];  // Changed from completedTasks to filteredTasks
}

export const TaskHistoryStats: React.FC<TaskHistoryStatsProps> = ({ filteredTasks }) => {
  // Calculate average score based on filtered tasks
  const averageScore = useMemo(() => {
    if (filteredTasks.length === 0) return 0;
    const totalScore = filteredTasks.reduce((sum, task) => sum + task.totalScore, 0);
    return (totalScore / filteredTasks.length).toFixed(1);
  }, [filteredTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Total concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{filteredTasks.length}</div>
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
