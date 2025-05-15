
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TaskHistoryStatsProps {
  completedTasks: Task[];
}

export const TaskHistoryStats: React.FC<TaskHistoryStatsProps> = ({ completedTasks }) => {
  // Calculate average score
  const averageScore = useMemo(() => {
    if (completedTasks.length === 0) return 0;
    const totalScore = completedTasks.reduce((sum, task) => sum + task.totalScore, 0);
    return (totalScore / completedTasks.length).toFixed(1);
  }, [completedTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Total concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{completedTasks.length}</div>
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
