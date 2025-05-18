
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
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
        
        {/* Chart - Modern, clean style */}
        <div className="h-[180px] mt-6 mb-4">
          <ChartContainer
            config={{
              created: {
                label: 'Tarefas Cadastradas',
                theme: { 
                  light: '#D3E4FD', // Soft blue for tasks created
                  dark: '#D3E4FD' 
                },
              },
              completed: {
                label: 'Tarefas Concluídas',
                theme: { 
                  light: '#F2FCE2', // Soft green for tasks completed
                  dark: '#F2FCE2' 
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid 
                  vertical={true}
                  horizontal={false}
                  verticalPoints={chartData.map((_, index) => index)}
                  stroke="#EBEBEB"
                  strokeDasharray="3 3"
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#8E9196' }}
                  dy={5}
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
                  strokeWidth={2.5}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  dot={{ r: 0 }}
                  style={{ strokeLinecap: "round" }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  strokeWidth={2.5}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  dot={{ r: 0 }}
                  style={{ strokeLinecap: "round" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Clear Legend with labels */}
        <div className="flex justify-center gap-6 mt-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-[#D3E4FD] rounded"></div>
            <span className="text-xs text-[#1A1F2C]">Tarefas Cadastradas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-[#F2FCE2] rounded"></div>
            <span className="text-xs text-[#1A1F2C]">Tarefas Concluídas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsDisplay;
