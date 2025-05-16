
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, LabelList, Tooltip } from 'recharts';
import { useFeedbackAnalysis, GRADIENTS } from './hooks/useFeedbackAnalysis';

interface FeedbackAnalysisCardProps {
  tasks: Task[];
}

// Custom tooltip component for the feedback chart
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const feedbackMessages: Record<string, string> = {
    transformed: "das suas tarefas te transformaram.",
    relief: "das suas tarefas te deram alívio.",
    obligation: "das suas tarefas foram só obrigação."
  };
  
  const titleMapping: Record<string, string> = {
    transformed: "Me transformou 😎",
    relief: "Deu alívio 🍃",
    obligation: "Foi só obrigação 😒"
  };
  
  return (
    <div className="bg-background border rounded-md shadow-md p-3 text-sm">
      <p className="font-medium">{titleMapping[data.id]}</p>
      <p className="text-muted-foreground">{data.percent}% {feedbackMessages[data.id]}</p>
    </div>
  );
};

const FeedbackAnalysisCard: React.FC<FeedbackAnalysisCardProps> = ({ tasks }) => {
  // Use the feedback analysis hook
  const feedbackData = useFeedbackAnalysis(tasks);
  
  // Function to get feedback title based on id
  const getFeedbackTitle = (id: string) => {
    const titles = {
      transformed: 'Me transformou 😎',
      relief: 'Deu alívio 🍃',
      obligation: 'Foi só obrigação 😒'
    };
    
    const emoji = id === 'transformed' 
      ? '🟢' 
      : id === 'relief' 
        ? '🔵' 
        : '⚪️';
    
    return `${titles[id as keyof typeof titles]}`;
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Impacto emocional das tarefas:</CardTitle>
        <CardDescription className="!mt-[25px]">Veja a proporção entre tarefas que te transformaram, trouxeram alívio ou foram apenas cumpridas por obrigação.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <div className="h-64">
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
                  margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0, 0, 0, 0.05)'}} />
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
                      offset={10}
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
        
        {/* Dynamic Insight Box - moved directly below the chart without spacing */}
        {feedbackData.withFeedback && feedbackData.topFeedback && (
          <div>
            <div 
              className="border rounded-lg p-4 animate-fade-in"
              style={{ 
                background: GRADIENTS[feedbackData.topFeedback as keyof typeof GRADIENTS],
                animationDuration: '0.3s',
                transition: 'background 0.3s ease'
              }}
            >
              <h4 className="font-medium mb-3 text-base">
                A sensação mais comum foi: {getFeedbackTitle(feedbackData.topFeedback)}
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {feedbackData.insight}
              </p>
            </div>
          </div>
        )}
        
        {/* Empty space filler that pushes content up */}
        <div className="flex-grow"></div>
      </CardContent>
    </Card>
  );
};

export default FeedbackAnalysisCard;
