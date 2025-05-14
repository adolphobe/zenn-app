
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { useInsightsAnalysis } from './hooks/useInsightsAnalysis';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarData.averages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Média" fill={(data) => data.color} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Nenhuma tarefa concluída no período selecionado</p>
            </div>
          )}
        </div>
        
        {/* Insights Section */}
        {pillarData.insights.length > 0 && (
          <div className="space-y-4 mt-4">
            <h3 className="font-medium text-lg">Insights</h3>
            {pillarData.insights.map((insight, index) => (
              <div key={index} className="border rounded-md p-3">
                <h4 className="font-medium mb-2">{insight.title}</h4>
                <ul className="space-y-2">
                  {insight.messages.map((message, msgIndex) => (
                    <li key={msgIndex} className="text-sm text-muted-foreground">{message}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
