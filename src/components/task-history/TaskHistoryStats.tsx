
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface TaskHistoryStatsProps {
  completedTasks: any[];
}

export const TaskHistoryStats: React.FC<TaskHistoryStatsProps> = ({ completedTasks }) => {
  // Calculate average score
  const averageScore = useMemo(() => {
    if (completedTasks.length === 0) return 0;
    const totalScore = completedTasks.reduce((sum, task) => sum + task.totalScore, 0);
    return (totalScore / completedTasks.length).toFixed(1);
  }, [completedTasks]);

  // Generate data for the trends chart
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return {
        date: date.toISOString().split('T')[0],
        label: format(date, 'dd/MM'),
        count: 0
      };
    }).reverse();
    
    // Count tasks completed on each day
    completedTasks.forEach(task => {
      const taskDate = new Date(task.completedAt);
      taskDate.setHours(0, 0, 0, 0);
      const dateStr = taskDate.toISOString().split('T')[0];
      
      const dayData = last7Days.find(d => d.date === dateStr);
      if (dayData) {
        dayData.count++;
      }
    });
    
    return last7Days;
  }, [completedTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Tendência (7 dias)</CardTitle>
        </CardHeader>
        <CardContent className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="label" fontSize={10} />
              <Tooltip />
              <Bar dataKey="count" fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
