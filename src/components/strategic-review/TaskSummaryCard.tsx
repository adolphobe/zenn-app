
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// Colors for the charts
const COLORS = {
  zone: {
    critical: '#ffcdd2',
    important: '#ffe0b2',
    moderate: '#bbdefb',
    hidden: '#e0e0e0'
  }
};

interface TaskSummaryCardProps {
  tasks: Task[];
}

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ tasks }) => {
  // Calculate zone distributions
  const zoneData = useMemo(() => {
    const zones = {
      critical: 0,
      important: 0,
      moderate: 0,
      hidden: 0
    };
    
    tasks.forEach(task => {
      if (task.totalScore >= 14) zones.critical++;
      else if (task.totalScore >= 11) zones.important++;
      else if (task.totalScore >= 8) zones.moderate++;
      else zones.hidden++;
    });
    
    return [
      { name: 'Zona de Ação Imediata', value: zones.critical, color: COLORS.zone.critical },
      { name: 'Zona de Mobilização', value: zones.important, color: COLORS.zone.important },
      { name: 'Zona Moderada', value: zones.moderate, color: COLORS.zone.moderate },
      { name: 'Zona Oculta', value: zones.hidden, color: COLORS.zone.hidden }
    ];
  }, [tasks]);
  
  // Calculate averages and insights
  const taskStats = useMemo(() => {
    if (tasks.length === 0) return { avgTotal: 0, highConsequence: 0, highPride: 0 };
    
    const avgTotal = tasks.reduce((sum, task) => sum + task.totalScore, 0) / tasks.length;
    const highConsequence = tasks.filter(task => task.consequenceScore >= 4).length;
    const highPride = tasks.filter(task => task.prideScore === 5).length;
    
    return { avgTotal, highConsequence, highPride };
  }, [tasks]);
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl">Resumo de Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{tasks.length}</div>
              <div className="mt-1 text-sm text-muted-foreground">Tarefas Concluídas</div>
            </div>
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{taskStats.avgTotal.toFixed(1)}</div>
              <div className="mt-1 text-sm text-muted-foreground">Média de Score</div>
            </div>
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{taskStats.highConsequence}</div>
              <div className="mt-1 text-sm text-muted-foreground">Alta Consequência</div>
            </div>
          </div>
          
          {/* Zone Distribution Chart */}
          <div className="mt-6 h-56">
            <ChartContainer 
              config={{
                critical: { color: COLORS.zone.critical },
                important: { color: COLORS.zone.important },
                moderate: { color: COLORS.zone.moderate },
                hidden: { color: COLORS.zone.hidden }
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
