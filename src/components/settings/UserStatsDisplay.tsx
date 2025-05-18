
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, subMonths } from 'date-fns';

// Sample data - will be replaced with real data later
const generateSampleData = () => {
  const today = new Date();
  const data = [];
  
  // Generate data for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    const month = format(date, 'MMM');
    
    // Simulating increasing tasks and completions over time
    const baseCreated = 10 + Math.floor(i * 5);
    const baseCompleted = Math.floor(baseCreated * 0.7); // 70% completion rate
    
    // Add some randomness
    const created = baseCreated + Math.floor(Math.random() * 10);
    const completed = Math.min(created, baseCompleted + Math.floor(Math.random() * 8));
    
    data.push({
      name: month,
      created: created,
      completed: completed,
    });
  }
  
  return data;
};

const chartData = generateSampleData();

const UserStatsDisplay: React.FC = () => {
  // Dados hipotéticos - serão substituídos mais tarde por dados reais
  const stats = {
    totalTasks: 124,
    completedTasks: 87,
    completionRate: 70, // percentual
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
        <CardDescription>
          Resumo da sua atividade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tarefas cadastradas</p>
            <p className="text-3xl font-bold">{stats.totalTasks}</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tarefas concluídas</p>
            <p className="text-3xl font-bold">{stats.completedTasks}</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Taxa de conclusão</p>
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-[200px] mt-6">
          <ChartContainer
            config={{
              created: {
                label: 'Tarefas Cadastradas',
                theme: { 
                  light: '#9b87f5', // Primary Purple
                  dark: '#9b87f5' 
                },
              },
              completed: {
                label: 'Tarefas Concluídas',
                theme: { 
                  light: '#33C3F0', // Sky Blue
                  dark: '#1EAEDB' 
                },
              },
            }}
          >
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                hide={true} 
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Line
                type="monotone"
                dataKey="created"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 1 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 1 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsDisplay;
