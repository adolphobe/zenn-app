
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils';
import { Task } from '@/types';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Pie, Cell, ResponsiveContainer } from 'recharts';
import { subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isSameDay, isWithinInterval, format } from 'date-fns';

// Period type definition
type PeriodType = 'today' | 'week' | 'month' | 'custom';

// Colors for the charts
const COLORS = {
  consequence: '#ea384c',
  pride: '#F97316',
  construction: '#0EA5E9',
  total: '#9b87f5',
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
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl">Resumo de Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{tasks.length}</div>
              <div className="mt-1 text-sm text-muted-foreground">Tarefas Concluídas</div>
            </div>
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{taskStats.avgTotal.toFixed(1)}</div>
              <div className="mt-1 text-sm text-muted-foreground">Média de Score</div>
            </div>
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <div className="text-4xl font-bold text-primary">{taskStats.highConsequence}</div>
              <div className="mt-1 text-sm text-muted-foreground">Alta Consequência</div>
            </div>
          </div>
          
          {/* Zone Distribution Chart */}
          <div className="mt-6 h-56">
            <ChartContainer 
              config={{
                critical: { color: COLORS.zone.critical },
                important: { color: COLORS.zone.important },
                moderate: { color: COLORS.zone.moderate },
                hidden: { color: COLORS.zone.hidden }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Bar
                  data={zoneData}
                  layout="vertical"
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
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
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
          { name: 'Consequência', value: 0, color: COLORS.consequence },
          { name: 'Orgulho', value: 0, color: COLORS.pride },
          { name: 'Construção', value: 0, color: COLORS.construction }
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
      { name: 'Consequência', value: avgConsequence, color: COLORS.consequence },
      { name: 'Orgulho', value: avgPride, color: COLORS.pride },
      { name: 'Construção', value: avgConstruction, color: COLORS.construction }
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
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl">Análise de Pilares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          {/* Pillar Chart */}
          <div className="h-64">
            <ChartContainer 
              config={{
                consequence: { color: COLORS.consequence },
                pride: { color: COLORS.pride },
                construction: { color: COLORS.construction }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Bar
                  data={pillarData.averages}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" barSize={60} radius={[4, 4, 0, 0]}>
                    {pillarData.averages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Insights */}
          {pillarData.insights.length > 0 ? (
            <div className="mt-6 space-y-4">
              {pillarData.insights.map((insight, i) => (
                <div key={i} className="rounded-md bg-primary/5 p-4">
                  <h4 className="mb-2 font-medium">{insight.title}</h4>
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
              <div className="rounded-md bg-primary/5 p-4">
                <p className="text-sm">Equilíbrio entre os pilares. Continue mantendo essa distribuição balanceada.</p>
              </div>
            )
          )}
          
          {tasks.length === 0 && (
            <div className="rounded-md bg-muted/30 p-4">
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
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
    <div className="w-full p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Revisão Estratégica</h1>
        <p className="text-muted-foreground">Período: {dateRangeDisplay}</p>
      </div>
      
      <Tabs defaultValue="week" value={period} onValueChange={(value) => setPeriod(value as PeriodType)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="month">Este Mês</TabsTrigger>
          <TabsTrigger value="custom">Últimos 30 dias</TabsTrigger>
        </TabsList>
        
        {/* Single TabsContent that updates based on the filter */}
        <TabsContent value={period} className="space-y-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskSummaryCard tasks={filteredTasks} />
            <PillarsAnalysisCard tasks={filteredTasks} />
            <FeedbackAnalysisCard tasks={filteredTasks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
