
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useZoneAnalysis } from './hooks/useZoneAnalysis';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface TaskSummaryCardProps {
  tasks: Task[];
}

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ tasks }) => {
  // Use the custom hook for zone analysis
  const { zoneData, taskStats, colors } = useZoneAnalysis(tasks);
  
  // If no tasks, show alert message
  if (tasks.length === 0) {
    return (
      <Alert 
        variant="destructive" 
        className="bg-red-50 border-red-100 text-red-800"
      >
        <AlertTitle className="text-lg font-medium">Nenhuma tarefa encontrada</AlertTitle>
        <AlertDescription>
          Não foram encontradas tarefas concluídas no período selecionado.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Prepare summary text with line breaks
  const mainSummary = `Neste período, você completou ${tasks.length} tarefas com uma média de score de ${taskStats.avgTotal.toFixed(1)}.`;
  const criticalSummary = taskStats.criticalCount > 0 ? `${taskStats.criticalCount} tarefas eram críticas.` : '';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Resumo de Tarefas</CardTitle>
        <CardDescription>Visão geral das tarefas concluídas no período.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Task Stats - Vertical Layout with reduced spacing */}
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-4xl font-bold text-blue-500">{tasks.length}</div>
              <div className="text-sm text-gray-600">Tarefas Concluídas</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-4xl font-bold text-blue-500">{taskStats.avgTotal.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Média de Score</div>
            </div>
          </div>
          
          {/* Zone Distribution Chart - with reduced height */}
          <div className="h-36 mt-2">
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
          
          {/* Zone Summary - with line breaks between sentences */}
          <div>
            <div 
              className="border rounded-lg p-3 animate-fade-in"
              style={{ 
                background: 'linear-gradient(to right, rgba(210, 230, 255, 0.5), rgba(180, 210, 250, 0.3))',
                animationDuration: '0.3s',
                transition: 'background 0.3s ease'
              }}
            >
              <h4 className="font-medium mb-1 text-base">
                📊 Distribuição por Zonas de Importância
              </h4>
              <p className="text-sm text-muted-foreground">
                {mainSummary}
                {criticalSummary && <><br />{criticalSummary}</>}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
