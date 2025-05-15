
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, Cell, ResponsiveContainer, PieChart } from 'recharts';
import { useFeedbackAnalysis, GRADIENTS } from './hooks/useFeedbackAnalysis';

interface FeedbackAnalysisCardProps {
  tasks: Task[];
}

// Custom label renderer type
interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const FeedbackAnalysisCard: React.FC<FeedbackAnalysisCardProps> = ({ tasks }) => {
  // Use the feedback analysis hook
  const feedbackData = useFeedbackAnalysis(tasks);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Check if the distribution item has a percent property
    const entry = feedbackData.distribution[index];
    const percentValue = entry?.percent || 0;
    
    return feedbackData.distribution[index].value > 0 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-semibold text-xs">
        {`${percentValue}%`}
      </text>
    ) : null;
  };
  
  // Get background gradient based on top feedback type
  const getInsightBackground = (topFeedback: string) => {
    switch (topFeedback) {
      case 'transformed': return GRADIENTS.transformed;
      case 'relief': return GRADIENTS.relief;
      case 'obligation': return GRADIENTS.obligation;
      default: return GRADIENTS.relief;
    }
  };
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl">Análise de Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          {/* Feedback Chart */}
          {tasks.length > 0 ? (
            <>
              {feedbackData.withFeedback ? (
                <div className="flex h-56 items-center justify-center">
                  <ChartContainer 
                    config={{
                      transformed: { color: feedbackData.distribution[0].color },
                      relief: { color: feedbackData.distribution[1].color },
                      obligation: { color: feedbackData.distribution[2].color }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={feedbackData.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          innerRadius={30} // Add innerRadius to create a donut chart
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={1000}
                          animationBegin={200}
                          animationEasing="ease-out"
                          paddingAngle={2} // Add padding between sections
                        >
                          {feedbackData.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : (
                <div className="my-8 rounded-md bg-muted/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Não há feedback registrado para as tarefas deste período.</p>
                </div>
              )}
              
              {/* Legend */}
              {feedbackData.withFeedback && (
                <div className="mt-4 flex justify-center gap-6">
                  {feedbackData.distribution.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Insight */}
              {feedbackData.insight && (
                <div 
                  className="mt-6 rounded-md p-4 animate-fade-in"
                  style={{ 
                    background: getInsightBackground(feedbackData.topFeedback),
                    animationDuration: '0.3s',
                    transition: 'background 0.3s ease'
                  }}
                >
                  <p className="text-sm">{feedbackData.insight}</p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-md bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Sem tarefas concluídas no período para análise de feedback.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackAnalysisCard;
