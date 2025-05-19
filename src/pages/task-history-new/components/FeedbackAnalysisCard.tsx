
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { useFeedbackAnalysis, GRADIENTS } from '@/components/strategic-review/hooks/useFeedbackAnalysis';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface FeedbackAnalysisCardProps {
  tasks: Task[];
}

const FeedbackAnalysisCard: React.FC<FeedbackAnalysisCardProps> = ({ tasks }) => {
  const { distribution, insight, withFeedback, topFeedback } = useFeedbackAnalysis(tasks);

  // Calculate if we have real data
  const hasData = withFeedback && distribution.some(item => item.value > 0);

  // Format the insight text from the raw insight string
  const formatInsightText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={i === 0 ? "font-medium mb-1" : "mb-1 text-sm"}>{line}</p>
    ));
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Análise de Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ChartContainer 
                config={{
                  transformed: { color: '#4CAF50' },
                  relief: { color: '#2196F3' },
                  obligation: { color: '#9E9E9E' }
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div 
              className="p-4 rounded-lg" 
              style={{ background: GRADIENTS[topFeedback] || GRADIENTS.balanced }}
            >
              <h3 className="text-lg font-medium mb-2">Insight:</h3>
              <div className="text-sm">
                {insight ? formatInsightText(insight) : (
                  <p>Sem dados suficientes para gerar insights.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Sem dados de feedback suficientes para análise</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackAnalysisCard;
