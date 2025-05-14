
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, Cell, ResponsiveContainer } from 'recharts';

// Colors for the charts
const COLORS = {
  feedback: {
    transformed: '#4CAF50',
    relief: '#2196F3',
    obligation: '#9E9E9E'
  }
};

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
  // Calculate feedback distribution
  const feedbackData = useMemo(() => {
    if (tasks.length === 0) {
      return {
        distribution: [
          { name: 'Me transformou', value: 0, color: COLORS.feedback.transformed },
          { name: 'Deu alívio', value: 0, color: COLORS.feedback.relief },
          { name: 'Foi só obrigação', value: 0, color: COLORS.feedback.obligation }
        ],
        insight: ''
      };
    }
    
    // Count actual feedback from tasks
    let transformed = 0;
    let relief = 0;
    let obligation = 0;
    
    tasks.forEach(task => {
      if (task.feedback === 'transformed') transformed++;
      else if (task.feedback === 'relief') relief++;
      else if (task.feedback === 'obligation') obligation++;
    });
    
    const total = transformed + relief + obligation;
    const withFeedback = total > 0;
    
    // Calculate percentages if we have feedback data
    const transformedPercent = withFeedback ? Math.round((transformed / total) * 100) : 0;
    const reliefPercent = withFeedback ? Math.round((relief / total) * 100) : 0;
    const obligationPercent = withFeedback ? Math.round((obligation / total) * 100) : 0;
    
    // Determine insight based on highest percentage
    let insight = '';
    
    if (withFeedback) {
      if (obligationPercent >= reliefPercent && obligationPercent >= transformedPercent) {
        insight = `${obligationPercent}% das suas tarefas foram classificadas como 'só obrigação'. Você pode estar executando sem identidade.`;
      } else if (transformedPercent >= reliefPercent && transformedPercent >= obligationPercent) {
        insight = `${transformedPercent}% das suas tarefas te 'transformaram'. Você está focando no que realmente te fortalece.`;
      } else if (reliefPercent >= transformedPercent && reliefPercent >= obligationPercent) {
        insight = `${reliefPercent}% das suas tarefas te deram 'alívio'. Você está buscando reduzir peso mais do que construir potência.`;
      }
    }
    
    return {
      distribution: [
        { name: 'Me transformou', value: transformed, percent: transformedPercent, color: COLORS.feedback.transformed },
        { name: 'Deu alívio', value: relief, percent: reliefPercent, color: COLORS.feedback.relief },
        { name: 'Foi só obrigação', value: obligation, percent: obligationPercent, color: COLORS.feedback.obligation }
      ],
      insight,
      withFeedback
    };
  }, [tasks]);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Check if the distribution item has a percent property before accessing it
    const entry = feedbackData.distribution[index];
    const percentValue = entry && 'percent' in entry ? entry.percent : 0;
    
    return feedbackData.distribution[index].value > 0 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${percentValue}%`}
      </text>
    ) : null;
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
                      transformed: { color: COLORS.feedback.transformed },
                      relief: { color: COLORS.feedback.relief },
                      obligation: { color: COLORS.feedback.obligation }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <Pie
                        data={feedbackData.distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {feedbackData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
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
                <div className="mt-6 rounded-md bg-primary/5 p-4">
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
