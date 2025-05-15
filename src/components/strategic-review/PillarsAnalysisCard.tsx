
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { useInsightsAnalysis } from './hooks/useInsightsAnalysis';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList, Cell } from 'recharts';
import { usePillarHover } from '@/context/hooks';

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Use the insights analysis hook to get pillar data
  const pillarData = useInsightsAnalysis(tasks);
  
  // Use the pillar hover hook to handle dynamic insights
  const { activeInsight, handlePillarHover } = usePillarHover(pillarData.insights, 'consequence');
  
  // Function to determine background gradient based on insight title
  const getBackgroundGradient = (title: string) => {
    if (title.includes('🟢')) {
      return 'linear-gradient(to right, rgba(240, 253, 244, 0.5), rgba(187, 247, 208, 0.3))';
    } else if (title.includes('🔴')) {
      return 'linear-gradient(to right, rgba(254, 242, 242, 0.5), rgba(254, 226, 226, 0.3))';
    } else {
      return 'linear-gradient(to right, rgba(240, 249, 255, 0.5), rgba(186, 230, 253, 0.3))';
    }
  };
  
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
                    onMouseEnter={(data) => {
                      handlePillarHover(data.id);
                    }}
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
        
        {/* Dynamic Insight Box */}
        {activeInsight && (
          <div className="space-y-4 mt-6">
            <div 
              className="border rounded-lg p-4 animate-fade-in"
              style={{ 
                background: getBackgroundGradient(activeInsight.title),
                animationDuration: '0.3s',
                transition: 'background 0.3s ease'
              }}
            >
              <h4 className="font-medium mb-3 text-base">{activeInsight.title}</h4>
              {activeInsight.messages.map((message, msgIndex) => (
                <p key={msgIndex} className="text-sm text-muted-foreground">{message}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
