
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { format, subMonths } from 'date-fns';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

// Calculate totals for pie chart
const calculatePieData = (data) => {
  const totalCreated = data.reduce((sum, item) => sum + item.created, 0);
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const incomplete = totalCreated - totalCompleted;
  
  return [
    { name: 'Concluídas', value: totalCompleted, color: '#92E3A9' }, // Soft green
    { name: 'Não Concluídas', value: incomplete, color: '#B1C9FB' }  // Soft blue
  ];
};

const pieData = calculatePieData(chartData);

// Custom tooltip component for pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md rounded-md border border-gray-100 text-xs">
        <p className="font-medium">{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

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
        
        {/* Chart and Details Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mt-2">
          {/* Compact Pie Chart - 120x120px */}
          <div className="relative w-[120px] h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={48}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Details */}
          <div className="flex flex-col space-y-3 md:flex-1">
            <h4 className="font-medium text-sm mb-1 text-center md:text-left">Distribuição de Tarefas</h4>
            
            <div className="flex flex-col space-y-2">
              {pieData.map((entry, index) => (
                <div key={`detail-${index}`} className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-gray-600">{entry.name}</span>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs font-medium cursor-help">{entry.value}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{Math.round((entry.value / stats.totalTasks) * 100)}% das tarefas</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center md:text-left">
              Passe o mouse sobre o gráfico para mais detalhes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsDisplay;
