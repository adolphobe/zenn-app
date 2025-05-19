
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TaskStatsProps {
  count: number;
  highScoreCount: number;
  averageScore: number;
  isFiltered: boolean;
}

/**
 * Component to display dynamic stats about completed tasks based on current filters
 */
export const TaskStats: React.FC<TaskStatsProps> = ({ 
  count, 
  highScoreCount, 
  averageScore,
  isFiltered
}) => {
  // Stats titles change based on whether filters are active
  const countTitle = isFiltered ? 'Resultados Encontrados' : 'Tarefas Concluídas';
  const highScoreTitle = isFiltered ? 'Alta Pontuação (Filtradas)' : 'Tarefas de Alta Pontuação';
  const avgScoreTitle = isFiltered ? 'Média (Filtradas)' : 'Pontuação Média';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">{count}</h3>
            <p className="text-sm text-muted-foreground">{countTitle}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600">{highScoreCount}</h3>
            <p className="text-sm text-muted-foreground">{highScoreTitle}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}</h3>
            <p className="text-sm text-muted-foreground">{avgScoreTitle}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
