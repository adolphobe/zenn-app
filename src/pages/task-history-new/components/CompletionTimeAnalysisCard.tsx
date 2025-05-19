
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { format, parseISO, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompletionTimeAnalysisCardProps {
  tasks: Task[];
}

const CompletionTimeAnalysisCard: React.FC<CompletionTimeAnalysisCardProps> = ({ tasks }) => {
  // Process data to show completion count by day of week
  const weekdayData = useMemo(() => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayCount = [0, 0, 0, 0, 0, 0, 0];
    
    // Count completions by day of week
    tasks.forEach(task => {
      if (task.completedAt) {
        const date = new Date(task.completedAt);
        const dayIndex = date.getDay();
        dayCount[dayIndex]++;
      }
    });
    
    // Create data for chart
    return dayNames.map((name, index) => ({
      name,
      count: dayCount[index],
    }));
  }, [tasks]);
  
  // Process data to show completion by time of day
  const timeOfDayData = useMemo(() => {
    const timeSlots = [
      { name: 'Manhã (6-12h)', start: 6, end: 12, count: 0 },
      { name: 'Tarde (12-18h)', start: 12, end: 18, count: 0 },
      { name: 'Noite (18-24h)', start: 18, end: 24, count: 0 },
      { name: 'Madrugada (0-6h)', start: 0, end: 6, count: 0 }
    ];
    
    // Count completions by time of day
    tasks.forEach(task => {
      if (task.completedAt) {
        const date = new Date(task.completedAt);
        const hours = date.getHours();
        
        for (const slot of timeSlots) {
          if (hours >= slot.start && hours < slot.end) {
            slot.count++;
            break;
          }
        }
      }
    });
    
    return timeSlots;
  }, [tasks]);

  const hasData = tasks.length > 0 && tasks.some(task => task.completedAt);
  
  if (!hasData) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Análise de Tempos de Conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Sem dados suficientes para análise</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Quando você conclui tarefas?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Por dia da semana</h3>
            <div className="h-64">
              <ChartContainer 
                config={{
                  count: { color: '#3B82F6' }
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekdayData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Tarefas concluídas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Por horário do dia</h3>
            <div className="h-64">
              <ChartContainer 
                config={{
                  count: { color: '#10B981' }
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeOfDayData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Tarefas concluídas" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionTimeAnalysisCard;
