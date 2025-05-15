
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
        className="bg-red-50 border-red-100 text-red-200"
      >
        <AlertTitle className="text-lg font-medium">Nenhuma tarefa encontrada</AlertTitle>
        <AlertDescription>
          Não foram encontradas tarefas concluídas no período selecionado.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Resumo de Tarefas</CardTitle>
        <CardDescription>Visão geral das tarefas concluídas no período.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task Stats - Side by side layout for better space usage */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-blue-50 py-[35px] px-2 text-center">
            <div className="text-[38px] font-bold text-blue-500">{tasks.length}</div>
            <div className="text-sm text-gray-600">Tarefas Concluídas</div>
          </div>
          <div className="rounded-lg bg-blue-50 py-[35px] px-2 text-center">
            <div className="text-[38px] font-bold text-blue-500">{taskStats.avgTotal.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Média de Score</div>
          </div>
        </div>
        
        {/* Summary text with line breaks */}
      <div className="border rounded-lg py-[20px] px-[22px] bg-gradient-to-r from-blue-50 to-blue-50/30">
          <h4 className="font-medium text-sm mb-1">📊 Distribuição por Zonas de Importância</h4>
          <p className="text-sm text-muted-foreground">
            Neste período, você completou {tasks.length} tarefas com uma média de score de {taskStats.avgTotal.toFixed(1)}.
            {taskStats.criticalCount > 0 && <><br />{taskStats.criticalCount} tarefas eram críticas.</>}
          </p>
        </div>
        
        {/* Modified: Removed height class from chart container div */}
        <div className="h-0">
          <ChartContainer 
            config={{
              critical: { color: colors.critical },
              important: { color: colors.important },
              moderate: { color: colors.moderate },
              hidden: { color: colors.hidden }
            }}
          >
            <ResponsiveContainer width="100%" height={60}>
              <Bar
                data={zoneData}
                dataKey="value"
                layout="vertical"
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} />
                <Tooltip content={<ChartTooltipContent />} />
                {zoneData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
