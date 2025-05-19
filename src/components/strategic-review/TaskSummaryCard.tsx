
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useZoneAnalysis } from './hooks/useZoneAnalysis';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface TaskSummaryCardProps {
  tasks: Task[];
}

// Custom tooltip content for the chart
const ChartTooltipContent = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  const item = payload[0];
  return (
    <div className="bg-background border rounded-md shadow-md p-3 text-sm">
      <p className="font-medium">{item.payload.name}</p>
      <p className="text-muted-foreground">Total: {item.value}</p>
    </div>
  );
};

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ tasks }) => {
  // Use the custom hook for zone analysis
  const { zoneData, taskStats, colors } = useZoneAnalysis(tasks || []);
  
  // DEBUG: Log data for analysis
  React.useEffect(() => {
    console.log("TaskSummaryCard: Recebeu tasks:", tasks?.length || 0);
    console.log("TaskSummaryCard: ZoneData:", zoneData);
    console.log("TaskSummaryCard: TaskStats:", taskStats);
    
    if (tasks && tasks.length > 0) {
      // Check if tasks have valid data for analysis
      const hasValidScores = tasks.every(task => 
        typeof task.consequenceScore === 'number' && 
        typeof task.prideScore === 'number' && 
        typeof task.constructionScore === 'number'
      );
      
      console.log("TaskSummaryCard: Tasks têm scores válidos:", hasValidScores);
      
      // Log some sample tasks
      tasks.slice(0, 2).forEach((task, i) => {
        console.log(`TaskSummaryCard: Amostra #${i+1}:`, {
          id: task.id,
          title: task.title,
          completed: task.completed,
          completedAt: task.completedAt,
          scores: {
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore,
            totalScore: task.totalScore
          }
        });
      });
    }
  }, [tasks]);
  
  // If no tasks, show alert message with more details
  if (!tasks || tasks.length === 0) {
    return (
      <Alert 
        variant="destructive" 
        className="bg-red-50 border-red-100 text-red-400 py-[30px] px-[32px]"
      >
        <AlertTitle className="text-lg font-medium">Nenhuma tarefa encontrada</AlertTitle>
        <AlertDescription>
          Não foram encontradas tarefas concluídas no período selecionado.
          <div className="mt-2 text-sm">
            <p>Possíveis soluções:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Tente selecionar um período maior (semana, mês, ou "Todo o Tempo")</li>
              <li>Verifique se você possui tarefas concluídas com datas de conclusão</li>
              <li>Crie e complete tarefas para visualizar análises</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  // If no zone data or task stats despite having tasks, show a different message
  if ((!zoneData || zoneData.length === 0 || !taskStats) && tasks.length > 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resumo de Tarefas</CardTitle>
          <CardDescription>Visão geral das tarefas concluídas no período.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-yellow-50 border-yellow-100">
            <AlertTitle>Dados incompletos</AlertTitle>
            <AlertDescription>
              Algumas tarefas foram encontradas, mas não possuem dados completos para análise.
              Verifique se as tarefas possuem pontuações atribuídas.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <div className="rounded-lg bg-blue-50 py-[35px] px-2 text-center">
              <div className="text-[38px] font-bold text-blue-500">{tasks.length}</div>
              <div className="text-sm text-gray-600">Tarefas Encontradas</div>
            </div>
          </div>
        </CardContent>
      </Card>
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
            <div className="text-[38px] font-bold text-blue-500">{taskStats?.avgTotal?.toFixed(1) || '0.0'}</div>
            <div className="text-sm text-gray-600">Média de Score</div>
          </div>
        </div>
        
        {/* Summary text with line breaks */}
        <div className="border rounded-lg py-[20px] px-[22px] bg-gradient-to-r from-blue-50 to-blue-50/30">
          <h4 className="font-medium text-sm mb-1">📊 Detalhes</h4>
          <p className="text-sm text-muted-foreground">
            Neste período, você completou {tasks.length} tarefas com uma média de score de {taskStats?.avgTotal?.toFixed(1) || '0.0'}
            {taskStats?.criticalCount > 0 && <><br />{taskStats.criticalCount} tarefas eram críticas.</>}
          </p>
        </div>
        
        {/* Chart container with fixed height */}
        {zoneData && zoneData.length > 0 && (
          <div className="h-[160px]">
            <ChartContainer 
              config={{
                critical: { color: colors?.critical || '#ffcdd2' },
                important: { color: colors?.important || '#ffe0b2' },
                moderate: { color: colors?.moderate || '#bbdefb' },
                hidden: { color: colors?.hidden || '#e0e0e0' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Bar
                  data={zoneData || []}
                  dataKey="value"
                  layout="vertical"
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={140} />
                  <Tooltip content={<ChartTooltipContent />} />
                  {zoneData && zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
