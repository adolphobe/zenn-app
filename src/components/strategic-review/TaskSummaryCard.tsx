
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
