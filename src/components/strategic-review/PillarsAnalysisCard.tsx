
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { useInsightsAnalysis } from './hooks/useInsightsAnalysis';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList, Cell } from 'recharts';

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Use the insights analysis hook to get pillar data
  const pillarData = useInsightsAnalysis(tasks);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Pilares</CardTitle>
        <CardDescription>Distribuição e análise dos pilares estratégicos nas tarefas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-6">
          {pillarData.averages.length > 0 ? (
            <ChartContainer 
              className="h-full w-full"
              config={{
                consequence: { color: '#3B82F6' }, // Azul
                pride: { color: '#F97316' },       // Laranja
                construction: { color: '#10B981' }, // Verde
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pillarData.averages} barGap={12} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <ChartTooltip 
                    content={({ active, payload }) => (
                      <ChartTooltipContent active={active} payload={payload} />
                    )} 
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={80}
                    fillOpacity={0.9}
                    animationDuration={1000}
                    animationBegin={200}
                    animationEasing="ease-out"
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      fill="#888888"
                      formatter={(value: number) => value.toFixed(1)}
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    {pillarData.averages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Nenhuma tarefa concluída no período selecionado</p>
            </div>
          )}
        </div>
        
        {/* Insights Section - Improved with animations and better styling */}
        {pillarData.insights.length > 0 && (
          <div className="space-y-4 mt-6 animate-fade-in">
            <h3 className="font-medium text-lg">Insights</h3>
            <div className="grid gap-4 md:grid-cols-1">
              {pillarData.insights.map((insight, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animationDuration: '0.5s',
                    animationFillMode: 'both',
                    animationName: 'fadeIn',
                    background: insight.title.includes('🟢') 
                      ? 'linear-gradient(to right, rgba(240, 253, 244, 0.5), rgba(187, 247, 208, 0.3))' 
                      : insight.title.includes('🔴')
                      ? 'linear-gradient(to right, rgba(254, 242, 242, 0.5), rgba(254, 226, 226, 0.3))'
                      : 'linear-gradient(to right, rgba(240, 249, 255, 0.5), rgba(186, 230, 253, 0.3))'
                  }}
                >
                  <h4 className="font-medium mb-3 text-base">{insight.title}</h4>
                  <ul className="space-y-2">
                    {insight.messages.map((message, msgIndex) => (
                      <li key={msgIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-lg mt-0.5">•</span>
                        <span>{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
