
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserStatsDisplay: React.FC = () => {
  // Dados hipotéticos - serão substituídos mais tarde por dados reais
  const stats = {
    totalTasks: 124,
    completedTasks: 87,
    completionRate: 70, // percentual
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
        <CardDescription>
          Resumo da sua atividade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tarefas cadastradas</p>
            <p className="text-3xl font-bold">{stats.totalTasks}</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tarefas concluídas</p>
            <p className="text-3xl font-bold">{stats.completedTasks}</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Taxa de conclusão</p>
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsDisplay;
