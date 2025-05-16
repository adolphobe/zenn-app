
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, LabelList, Tooltip } from 'recharts';
import { useFeedbackAnalysis, GRADIENTS } from './hooks/useFeedbackAnalysis';

interface FeedbackAnalysisCardProps {
  tasks: Task[];
}

const FeedbackAnalysisCard: React.FC<FeedbackAnalysisCardProps> = ({ tasks }) => {
  // Use the feedback analysis hook
  const feedbackData = useFeedbackAnalysis(tasks);
  
  // Function to get feedback title based on id
  const getFeedbackTitle = (id: string) => {
    const titles = {
      transformed: 'Me transformou',
      relief: 'Deu alívio',
      obligation: 'Foi só obrigação'
    };
    
    const emoji = id === 'transformed' 
      ? '🟢' 
      : id === 'relief' 
        ? '🔵' 
        : '⚪️';
    
    return `${emoji} ${titles[id as keyof typeof titles]}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impacto Emocional das tarefas concluídas:</CardTitle>
        <CardDescription>Veja a proporção entre tarefas que te transformaram, trouxeram alívio ou foram apenas cumpridas por obrigação.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-6">
          {feedbackData.withFeedback ? (
            <ChartContainer 
              className="h-full w-full"
              config={{
                transformed: { color: '#4CAF50' }, // Verde
                relief: { color: '#2196F3' },       // Azul
                obligation: { color: '#9E9E9E' },   // Cinza
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={feedbackData.distribution} 
                  barGap={12} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
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
                      dataKey="percent" 
                      position="top" 
                      fill="#888888"
                      formatter={(value: number) => `${value}%`}
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    {feedbackData.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Nenhuma tarefa com feedback no período selecionado</p>
            </div>
          )}
        </div>
        
        {/* Dynamic Insight Box */}
        {feedbackData.withFeedback && feedbackData.topFeedback && (
          <div className="space-y-4 mt-6">
            <div 
              className="border rounded-lg p-4 animate-fade-in"
              style={{ 
                background: GRADIENTS[feedbackData.topFeedback as keyof typeof GRADIENTS],
                animationDuration: '0.3s',
                transition: 'background 0.3s ease'
              }}
            >
              <h4 className="font-medium mb-3 text-base">
                {getFeedbackTitle(feedbackData.topFeedback)}
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {feedbackData.insight}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackAnalysisCard;
