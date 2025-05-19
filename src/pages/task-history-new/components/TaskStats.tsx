
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TaskStatsProps {
  count: number;
  highScoreCount: number;
  averageScore: number;
}

/**
 * Component to display basic stats about completed tasks
 */
export const TaskStats: React.FC<TaskStatsProps> = ({ 
  count, 
  highScoreCount, 
  averageScore 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">{count}</h3>
            <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600">{highScoreCount}</h3>
            <p className="text-sm text-muted-foreground">Tarefas de Alta Pontuação</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}</h3>
            <p className="text-sm text-muted-foreground">Pontuação Média</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
