
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, LabelList, Tooltip } from 'recharts';
import { useFeedbackAnalysis, GRADIENTS } from './hooks/useFeedbackAnalysis';

interface FeedbackAnalysisCardProps {
  tasks: Task[];
}

const FeedbackAnalysisCard: React.FC<FeedbackAnalysisCardProps> = ({ tasks }) => {
  // Use the feedback analysis hook
  const feedbackData = useFeedbackAnalysis(tasks);
  
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
                <div className="h-56 w-full">
                  <ChartContainer 
                    config={{
                      transformed: { color: feedbackData.distribution[0].color },
                      relief: { color: feedbackData.distribution[1].color },
                      obligation: { color: feedbackData.distribution[2].color }
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
                </div>
              ) : (
                <div className="my-8 rounded-md bg-muted/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Não há feedback registrado para as tarefas deste período.</p>
                </div>
              )}
              
              {/* Legend Box */}
              {feedbackData.withFeedback && (
                <div className="mt-4 p-3 bg-muted/20 rounded-md">
                  <div className="flex justify-center gap-6 mb-3">
                    {feedbackData.distribution.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Insight */}
                  {feedbackData.insight && (
                    <p className="text-sm text-center">{feedbackData.insight}</p>
                  )}
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
