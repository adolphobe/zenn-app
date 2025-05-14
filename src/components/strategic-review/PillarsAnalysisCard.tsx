
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Calculate pillar distribution
  const pillarDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    tasks.forEach(task => {
      if (task.pillar) {
        distribution[task.pillar] = (distribution[task.pillar] || 0) + 1;
      }
    });
    
    // Convert to array of objects for Recharts
    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tasks]);
  
  // Calculate completion rate (example, adjust as needed)
  const completionRate = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const rate = (completedTasks.length / tasks.length) * 100 || 0;
    return rate.toFixed(2);
  }, [tasks]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Pilares</CardTitle>
        <CardDescription>Distribuição de tarefas por pilar estratégico.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {pillarDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pillarDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Nenhuma tarefa com pilar estratégico encontrada</p>
          </div>
        )}
        <p className="mt-4">Taxa de Conclusão: {completionRate}%</p>
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
