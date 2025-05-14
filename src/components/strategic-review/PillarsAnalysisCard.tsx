
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useInsightsAnalysis, PILLAR_COLORS } from './hooks/useInsightsAnalysis';

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Use the custom hook to get pillar data and insights
  const pillarData = useInsightsAnalysis(tasks);
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl">Análise de Pilares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          {/* Pillar Chart */}
          <div className="h-64">
            <ChartContainer 
              config={{
                consequence: { color: PILLAR_COLORS.consequence },
                pride: { color: PILLAR_COLORS.pride },
                construction: { color: PILLAR_COLORS.construction }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Bar
                  data={pillarData.averages}
                  dataKey="value"
                  barSize={60}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5] as [number, number]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  {pillarData.averages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} radius={[4, 4, 0, 0]} />
                  ))}
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Insights */}
          {pillarData.insights.length > 0 ? (
            <div className="mt-6 space-y-4">
              {pillarData.insights.map((insight, i) => (
                <div key={i} className="rounded-md bg-primary/5 p-4">
                  <h4 className="mb-2 font-medium">{insight.title}</h4>
                  <ul className="space-y-2">
                    {insight.messages.map((message, j) => (
                      <li key={j} className="text-sm">{message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            tasks.length > 0 && (
              <div className="rounded-md bg-primary/5 p-4">
                <p className="text-sm">Equilíbrio entre os pilares. Continue mantendo essa distribuição balanceada.</p>
              </div>
            )
          )}
          
          {tasks.length === 0 && (
            <div className="rounded-md bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Sem tarefas concluídas no período para análise.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
