
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useZoneAnalysis } from './hooks/useZoneAnalysis';

interface TaskSummaryCardProps {
  tasks: Task[];
}

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ tasks }) => {
  // Use the custom hook for zone analysis
  const { zoneData, taskStats, colors } = useZoneAnalysis(tasks);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Resumo de Tarefas</CardTitle>
        <CardDescription>Visão geral das tarefas concluídas no período.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          {/* Task Stats - Vertical Layout */}
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{tasks.length}</div>
              <div className="mt-1 text-sm text-muted-foreground">Tarefas Concluídas</div>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{taskStats.avgTotal.toFixed(1)}</div>
              <div className="mt-1 text-sm text-muted-foreground">Média de Score</div>
            </div>
          </div>
          
          {/* Zone Distribution Chart */}
          <div className="mt-6 h-56">
            <ChartContainer 
              config={{
                critical: { color: colors.critical },
                important: { color: colors.important },
                moderate: { color: colors.moderate },
                hidden: { color: colors.hidden }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Bar
                  data={zoneData}
                  dataKey="value"
                  layout="vertical"
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip content={<ChartTooltipContent />} />
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Zone Summary - Similar to other analysis cards */}
          <div className="space-y-4 mt-6">
            <div 
              className="border rounded-lg p-4 animate-fade-in"
              style={{ 
                background: 'linear-gradient(to right, rgba(210, 230, 255, 0.5), rgba(180, 210, 250, 0.3))',
                animationDuration: '0.3s',
                transition: 'background 0.3s ease'
              }}
            >
              <h4 className="font-medium mb-3 text-base">
                {tasks.length > 0 ? '📊 Distribuição por Zonas de Importância' : 'Sem tarefas no período selecionado'}
              </h4>
              {tasks.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Neste período, você completou {tasks.length} tarefas com uma média de score de {taskStats.avgTotal.toFixed(1)}.
                  {taskStats.criticalCount > 0 && ` ${taskStats.criticalCount} tarefas eram críticas.`}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
