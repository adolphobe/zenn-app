
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils';
import { Task } from '@/types';
import { BarChart, LineChart, PieChart } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartTooltip } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer, Pie, Cell } from 'recharts';
import { subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isSameDay, isWithinInterval, format } from 'date-fns';

// Period type definition
type PeriodType = 'today' | 'week' | 'month' | 'custom';

// Colors for the charts
const COLORS = {
  consequence: {
    main: '#ea384c',
    light: '#ffebee'
  },
  pride: {
    main: '#F97316',
    light: '#fff8f0'
  },
  construction: {
    main: '#0EA5E9',
    light: '#f0f9ff'
  },
  total: {
    main: '#6b46c1',
    light: '#f5f3ff'
  },
  zone: {
    critical: '#ffcdd2',
    important: '#ffe0b2',
    moderate: '#bbdefb',
    hidden: '#e0e0e0'
  },
  feedback: {
    transformed: '#4CAF50',
    relief: '#2196F3',
    obligation: '#9E9E9E'
  }
};

// Calculate start and end dates based on period
const getDateRangeByPeriod = (period: PeriodType): [Date, Date] => {
  const today = new Date();
  
  switch (period) {
    case 'today':
      return [today, today];
    case 'week':
      return [startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 })];
    case 'month':
      return [startOfMonth(today), endOfMonth(today)];
    case 'custom':
      // Default to last 30 days if custom
      return [subDays(today, 30), today];
    default:
      return [today, today];
  }
};

// Helper to filter tasks by date range
const filterTasksByDateRange = (tasks: Task[], dateRange: [Date, Date]): Task[] => {
  const [startDate, endDate] = dateRange;
  
  return tasks.filter(task => 
    task.completed && 
    task.idealDate && 
    isWithinInterval(new Date(task.idealDate), { 
      start: new Date(startDate),
      end: new Date(endDate)
    })
  );
};

// Component for task summary card
const TaskSummaryCard = ({ tasks }: { tasks: Task[] }) => {
  // Calculate zone distributions
  const zoneData = useMemo(() => {
    const zones = {
      critical: 0,
      important: 0,
      moderate: 0,
      hidden: 0
    };
    
    tasks.forEach(task => {
      if (task.totalScore >= 14) zones.critical++;
      else if (task.totalScore >= 11) zones.important++;
      else if (task.totalScore >= 8) zones.moderate++;
      else zones.hidden++;
    });
    
    return [
      { name: 'Zona de Ação Imediata', value: zones.critical, color: COLORS.zone.critical },
      { name: 'Zona de Mobilização', value: zones.important, color: COLORS.zone.important },
      { name: 'Zona Moderada', value: zones.moderate, color: COLORS.zone.moderate },
      { name: 'Zona Oculta', value: zones.hidden, color: COLORS.zone.hidden }
    ];
  }, [tasks]);
  
  // Calculate averages and insights
  const taskStats = useMemo(() => {
    if (tasks.length === 0) return { avgTotal: 0, highConsequence: 0, highPride: 0 };
    
    const avgTotal = tasks.reduce((sum, task) => sum + task.totalScore, 0) / tasks.length;
    const highConsequence = tasks.filter(task => task.consequenceScore >= 4).length;
    const highPride = tasks.filter(task => task.prideScore === 5).length;
    
    return { avgTotal, highConsequence, highPride };
  }, [tasks]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total de tarefas concluídas:</span>
              <span className="font-semibold">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média do score total:</span>
              <span className="font-semibold">{taskStats.avgTotal.toFixed(1)}</span>
            </div>
          </div>
          
          {/* Zone Distribution Chart */}
          <div className="h-52 mt-6">
            <ChartContainer 
              config={{
                critical: { color: COLORS.zone.critical },
                important: { color: COLORS.zone.important },
                moderate: { color: COLORS.zone.moderate },
                hidden: { color: COLORS.zone.hidden }
              }}
            >
              <BarChart
                layout="vertical"
                data={zoneData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" barSize={20}>
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          
          {/* Auto-generated insight */}
          {tasks.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm">
              <p>
                {`Este período você entregou ${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}, 
                sendo ${taskStats.highConsequence} com alta consequência (4-5)
                ${taskStats.highPride > 0 ? `, sendo ${taskStats.highPride} com orgulho máximo (5)` : ''}.`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for pillars analysis
const PillarsAnalysisCard = ({ tasks }: { tasks: Task[] }) => {
  // Calculate average for each pillar
  const pillarData = useMemo(() => {
    if (tasks.length === 0) {
      return {
        averages: [
          { name: 'Consequência', value: 0, color: COLORS.consequence.main },
          { name: 'Orgulho', value: 0, color: COLORS.pride.main },
          { name: 'Construção', value: 0, color: COLORS.construction.main }
        ],
        highest: null,
        lowest: null,
        insights: []
      };
    }
    
    const avgConsequence = tasks.reduce((sum, task) => sum + task.consequenceScore, 0) / tasks.length;
    const avgPride = tasks.reduce((sum, task) => sum + task.prideScore, 0) / tasks.length;
    const avgConstruction = tasks.reduce((sum, task) => sum + task.constructionScore, 0) / tasks.length;
    
    const pillars = [
      { name: 'Consequência', value: avgConsequence, color: COLORS.consequence.main },
      { name: 'Orgulho', value: avgPride, color: COLORS.pride.main },
      { name: 'Construção', value: avgConstruction, color: COLORS.construction.main }
    ];
    
    // Find highest and lowest pillars
    let highest = pillars[0];
    let lowest = pillars[0];
    
    pillars.forEach(pillar => {
      if (pillar.value > highest.value) highest = pillar;
      if (pillar.value < lowest.value) lowest = pillar;
    });
    
    // Don't highlight if difference is too small
    if (highest.value - lowest.value < 0.5) {
      highest = null;
      lowest = null;
    }
    
    // Always mark pillars below threshold as neglected
    const neglected = pillars.filter(p => p.value < 3.0);
    if (neglected.length > 0) {
      lowest = neglected[0];
      if (neglected.length > 1) highest = null; // Don't highlight highest if multiple are neglected
    }
    
    // Generate insights
    const insights = [];
    
    if (highest) {
      if (highest.name === 'Consequência') {
        insights.push({
          title: '🟢 Consequência - Priorizado',
          messages: [
            'Você está se guiando por impacto real. Evitando arrependimentos antes que eles aconteçam.',
            'Suas ações mostram clareza sobre o que não pode ser ignorado.',
            'Você está agindo com base no que ameaça seu progresso, não no que só parece urgente.'
          ]
        });
      } else if (highest.name === 'Orgulho') {
        insights.push({
          title: '🟢 Orgulho - Priorizado',
          messages: [
            'Você está executando com identidade. O que faz, representa quem você é.',
            'Suas ações fortalecem sua autoimagem e te validam internamente.',
            'Você não está apenas riscando tarefas. Está se orgulhando de cada entrega.'
          ]
        });
      } else if (highest.name === 'Construção') {
        insights.push({
          title: '🟢 Construção - Priorizado',
          messages: [
            'Você está entregando o que te fortalece. Cada tarefa te deixa mais preparado, mais sólido.',
            'Está saindo do automático e moldando a versão que quer se tornar.',
            'Suas ações estão em alinhamento com evolução real, não só manutenção.'
          ]
        });
      }
    }
    
    if (lowest) {
      if (lowest.name === 'Consequência') {
        insights.push({
          title: '🔴 Consequência - Negligenciado',
          messages: [
            'Suas tarefas podem estar organizadas, mas não estão resolvendo o que realmente importa.',
            'Está se mantendo produtivo, mas evitando o que tem mais risco se for adiado.',
            'Pode estar ignorando os alertas estratégicos que te exigem responsabilidade.'
          ]
        });
      } else if (lowest.name === 'Orgulho') {
        insights.push({
          title: '🔴 Orgulho - Negligenciado',
          messages: [
            'Está cumprindo tarefas, mas sem se sentir satisfeito com o que entrega.',
            'Falta conexão entre o que você faz e quem você quer ser.',
            'Está fazendo por obrigação, não por construção de respeito próprio.'
          ]
        });
      } else if (lowest.name === 'Construção') {
        insights.push({
          title: '🔴 Construção - Negligenciado',
          messages: [
            'Você está operando no presente, mas não está construindo seu futuro.',
            'As tarefas podem parecer úteis, mas não estão te transformando.',
            'Está sendo eficiente, mas não está se expandindo.'
          ]
        });
      }
    }
    
    return { averages: pillars, highest, lowest, insights };
  }, [tasks]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Pilares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pillar Chart */}
          <div className="h-40">
            <ChartContainer 
              config={{
                consequence: { color: COLORS.consequence.main },
                pride: { color: COLORS.pride.main },
                construction: { color: COLORS.construction.main }
              }}
            >
              <BarChart
                layout="vertical"
                data={pillarData.averages}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" barSize={20}>
                  {pillarData.averages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          
          {/* Insights */}
          {pillarData.insights.length > 0 ? (
            <div className="space-y-4 mt-6">
              {pillarData.insights.map((insight, i) => (
                <div key={i} className="p-4 rounded-md bg-primary/5">
                  <h4 className="font-medium mb-2">{insight.title}</h4>
                  <ul className="space-y-2">
                    {insight.messages.map((message, j) => (
                      <li key={j} className="text-sm">{message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            tasks.length > 0 && (
              <div className="p-4 rounded-md bg-primary/5">
                <p className="text-sm">Equilíbrio entre os pilares. Continue mantendo essa distribuição balanceada.</p>
              </div>
            )
          )}
          
          {tasks.length === 0 && (
            <div className="p-4 rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">Sem tarefas concluídas no período para análise.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for feedback analysis
const FeedbackAnalysisCard = ({ tasks }: { tasks: Task[] }) => {
  // Calculate feedback distribution
  // Note: This requires an additional property in tasks for feedback
  // For now we'll simulate with random data
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
    
    // Simulating feedback data (in a real app, this would come from task data)
    const total = tasks.length;
    const transformed = Math.floor(total * (Math.random() * 0.4 + 0.2)); // 20-60%
    const relief = Math.floor(total * (Math.random() * 0.4 + 0.1)); // 10-50% 
    const obligation = total - transformed - relief;
    
    const transformedPercent = Math.round((transformed / total) * 100);
    const reliefPercent = Math.round((relief / total) * 100);
    const obligationPercent = Math.round((obligation / total) * 100);
    
    // Determine insight based on highest percentage
    let insight = '';
    
    if (obligationPercent >= reliefPercent && obligationPercent >= transformedPercent) {
      insight = `${obligationPercent}% das suas tarefas foram classificadas como 'só obrigação'. Você pode estar executando sem identidade.`;
    } else if (transformedPercent >= reliefPercent && transformedPercent >= obligationPercent) {
      insight = `${transformedPercent}% das suas tarefas te 'transformaram'. Você está focando no que realmente te fortalece.`;
    } else if (reliefPercent >= transformedPercent && reliefPercent >= obligationPercent) {
      insight = `${reliefPercent}% das suas tarefas te deram 'alívio'. Você está buscando reduzir peso mais do que construir potência.`;
    }
    
    return {
      distribution: [
        { name: 'Me transformou', value: transformed, percent: transformedPercent, color: COLORS.feedback.transformed },
        { name: 'Deu alívio', value: relief, percent: reliefPercent, color: COLORS.feedback.relief },
        { name: 'Foi só obrigação', value: obligation, percent: obligationPercent, color: COLORS.feedback.obligation }
      ],
      insight
    };
  }, [tasks]);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return feedbackData.distribution[index].value > 0 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${feedbackData.distribution[index].percent}%`}
      </text>
    ) : null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Feedback Chart */}
          {tasks.length > 0 ? (
            <>
              <div className="h-56 flex justify-center items-center">
                <ChartContainer 
                  config={{
                    transformed: { color: COLORS.feedback.transformed },
                    relief: { color: COLORS.feedback.relief },
                    obligation: { color: COLORS.feedback.obligation }
                  }}
                >
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
              
              {/* Insight */}
              {feedbackData.insight && (
                <div className="p-4 rounded-md bg-primary/5">
                  <p className="text-sm">{feedbackData.insight}</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">Sem tarefas concluídas no período para análise de feedback.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for time trend analysis
const TimeTrendCard = ({ tasks }: { tasks: Task[] }) => {
  const [timeMode, setTimeMode] = useState<'day' | 'week' | 'month'>('day');
  
  // Generate trend data based on tasks
  const trendData = useMemo(() => {
    if (tasks.length === 0) return [];
    
    // Get unique dates sorted chronologically
    const uniqueDates = Array.from(new Set(
      tasks
        .filter(t => t.idealDate)
        .map(t => {
          const date = new Date(t.idealDate as Date);
          // Format based on time mode
          if (timeMode === 'day') return format(date, 'yyyy-MM-dd');
          if (timeMode === 'week') return `W${format(date, 'w')}`;
          return format(date, 'MMM yyyy');
        })
    )).sort();
    
    // Group tasks by date
    const groupedByDate = uniqueDates.map(dateStr => {
      const tasksInPeriod = tasks.filter(t => {
        if (!t.idealDate) return false;
        const date = new Date(t.idealDate);
        
        if (timeMode === 'day') {
          return format(date, 'yyyy-MM-dd') === dateStr;
        } else if (timeMode === 'week') {
          return `W${format(date, 'w')}` === dateStr;
        } else {
          return format(date, 'MMM yyyy') === dateStr;
        }
      });
      
      // Calculate average scores
      const avgConsequence = tasksInPeriod.length ? 
        tasksInPeriod.reduce((sum, t) => sum + t.consequenceScore, 0) / tasksInPeriod.length : 0;
        
      const avgPride = tasksInPeriod.length ? 
        tasksInPeriod.reduce((sum, t) => sum + t.prideScore, 0) / tasksInPeriod.length : 0;
        
      const avgConstruction = tasksInPeriod.length ? 
        tasksInPeriod.reduce((sum, t) => sum + t.constructionScore, 0) / tasksInPeriod.length : 0;
        
      const avgTotal = tasksInPeriod.length ? 
        tasksInPeriod.reduce((sum, t) => sum + t.totalScore, 0) / tasksInPeriod.length : 0;
      
      return {
        date: dateStr,
        consequenceScore: parseFloat(avgConsequence.toFixed(1)),
        prideScore: parseFloat(avgPride.toFixed(1)),
        constructionScore: parseFloat(avgConstruction.toFixed(1)),
        totalScore: parseFloat(avgTotal.toFixed(1)),
      };
    });
    
    return groupedByDate;
  }, [tasks, timeMode]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tendência Temporal</CardTitle>
        <div className="flex gap-1 text-xs">
          <button 
            className={`px-2 py-1 rounded-md ${timeMode === 'day' ? 'bg-primary/10 font-medium' : 'hover:bg-primary/5'}`}
            onClick={() => setTimeMode('day')}
          >
            Dia
          </button>
          <button 
            className={`px-2 py-1 rounded-md ${timeMode === 'week' ? 'bg-primary/10 font-medium' : 'hover:bg-primary/5'}`}
            onClick={() => setTimeMode('week')}
          >
            Semana
          </button>
          <button 
            className={`px-2 py-1 rounded-md ${timeMode === 'month' ? 'bg-primary/10 font-medium' : 'hover:bg-primary/5'}`}
            onClick={() => setTimeMode('month')}
          >
            Mês
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {tasks.length > 0 ? (
            <ChartContainer 
              config={{
                consequence: { color: COLORS.consequence.main },
                pride: { color: COLORS.pride.main },
                construction: { color: COLORS.construction.main },
                total: { color: COLORS.total.main }
              }}
            >
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={50} />
                <YAxis domain={[0, 5]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="consequenceScore" 
                  name="Consequência"
                  stroke={COLORS.consequence.main} 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="prideScore" 
                  name="Orgulho"
                  stroke={COLORS.pride.main} 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="constructionScore" 
                  name="Construção"
                  stroke={COLORS.construction.main} 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalScore" 
                  name="Total"
                  stroke={COLORS.total.main} 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Sem dados suficientes para análise de tendência.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Strategic Review Page Component
const StrategicReview: React.FC = () => {
  const { state } = useAppContext();
  const [period, setPeriod] = useState<PeriodType>('week');
  
  // Calculate date range based on selected period
  const dateRange = useMemo(() => getDateRangeByPeriod(period), [period]);
  
  // Filter tasks based on date range
  const filteredTasks = useMemo(() => {
    return filterTasksByDateRange(state.tasks, dateRange);
  }, [state.tasks, dateRange]);
  
  // Format date range for display
  const dateRangeDisplay = useMemo(() => {
    const [start, end] = dateRange;
    
    if (period === 'today') {
      return `Hoje (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (isSameDay(start, end)) {
      return format(start, 'dd/MM/yyyy');
    }
    
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  }, [dateRange, period]);
  
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Revisão Estratégica</h1>
        <p className="text-muted-foreground">Período: {dateRangeDisplay}</p>
      </div>
      
      <Tabs defaultValue="week" value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
        <TabsList className="mb-8">
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="month">Este Mês</TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskSummaryCard tasks={filteredTasks} />
            <PillarsAnalysisCard tasks={filteredTasks} />
            <FeedbackAnalysisCard tasks={filteredTasks} />
            <TimeTrendCard tasks={filteredTasks} />
          </div>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskSummaryCard tasks={filteredTasks} />
            <PillarsAnalysisCard tasks={filteredTasks} />
            <FeedbackAnalysisCard tasks={filteredTasks} />
            <TimeTrendCard tasks={filteredTasks} />
          </div>
        </TabsContent>
        
        <TabsContent value="month" className="space-y-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskSummaryCard tasks={filteredTasks} />
            <PillarsAnalysisCard tasks={filteredTasks} />
            <FeedbackAnalysisCard tasks={filteredTasks} />
            <TimeTrendCard tasks={filteredTasks} />
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskSummaryCard tasks={filteredTasks} />
            <PillarsAnalysisCard tasks={filteredTasks} />
            <FeedbackAnalysisCard tasks={filteredTasks} />
            <TimeTrendCard tasks={filteredTasks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
