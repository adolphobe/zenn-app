
import React, { useState } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import PeriodTabs from '@/components/strategic-review/PeriodTabs';
import { useStrategicReviewState } from '@/components/strategic-review/hooks/useStrategicReviewState';
import { useInsightsAnalysis } from '@/components/strategic-review/hooks/useInsightsAnalysis';
import { useFeedbackAnalysis } from '@/components/strategic-review/hooks/useFeedbackAnalysis';
import PillarInsight from '@/components/strategic-review/components/PillarInsight';
import PillarChart from '@/components/strategic-review/components/PillarChart';
import DateRangePicker from '@/components/strategic-review/DateRangePicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, Pie, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

const MobileStrategicReviewPage = () => {
  const { allTasks, tasksLoading } = useTaskDataContext();
  const [focusedPillar, setFocusedPillar] = useState<string | null>(null);
  
  const {
    period,
    customStartDate,
    customEndDate,
    showCustomDatePicker,
    dateRangeDisplay,
    filteredTasks,
    taskStats,
    setCustomStartDate,
    setCustomEndDate,
    handlePeriodChange
  } = useStrategicReviewState(allTasks);

  const pillarsData = useInsightsAnalysis(filteredTasks);
  const feedbackData = useFeedbackAnalysis(filteredTasks);
  
  // Loading states
  if (tasksLoading) {
    return (
      <div className="p-4">
        <Alert className="mb-4">
          <AlertDescription>Carregando dados de análise...</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // If no tasks at all
  if (allTasks.length === 0) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>
            Nenhuma tarefa encontrada. Crie tarefas para ver análises.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, "dd MMM, yyyy", { locale: ptBR });
  };

  // Render focused insight
  const renderFocusedInsight = () => {
    if (!focusedPillar) return null;
    
    const insight = pillarsData?.insights?.find(i => i.id === focusedPillar);
    if (!insight) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <PillarInsight insight={insight} />
      </motion.div>
    );
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <h1 className="text-xl font-bold mb-4">Análise Estratégica</h1>
      
      {/* Period selector */}
      <div className="mb-6">
        <PeriodTabs period={period} onPeriodChange={handlePeriodChange} />
        
        {showCustomDatePicker && (
          <div className="mt-4">
            <DateRangePicker 
              startDate={customStartDate}
              endDate={customEndDate}
              onStartDateChange={setCustomStartDate}
              onEndDateChange={setCustomEndDate}
            />
          </div>
        )}
        
        <div className="text-sm font-medium text-muted-foreground mt-2">
          {dateRangeDisplay}
        </div>
      </div>
      
      {/* Task summary card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resumo de Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Tarefas Concluídas</p>
              <p className="text-xl font-medium">{taskStats?.totalFilteredTasks || 0}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Score Médio</p>
              <p className="text-xl font-medium">
                {filteredTasks.length > 0 ? 
                  (filteredTasks.reduce((sum, task) => sum + (task.totalScore || 0), 0) / filteredTasks.length).toFixed(1) : 
                  '0.0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback analysis card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Impacto Emocional</CardTitle>
        </CardHeader>
        <CardContent>
          {feedbackData.withFeedback ? (
            <div className="space-y-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feedbackData.distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {feedbackData.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-line">
                  {feedbackData.insight}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">
                Sem dados de feedback para o período selecionado
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pillar analysis card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Foco das Suas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              <div className="h-[200px]">
                <PillarChart 
                  data={pillarsData.averages} 
                  onPillarHover={setFocusedPillar} 
                  height={200}
                />
              </div>
              
              {renderFocusedInsight()}
              
              {!focusedPillar && pillarsData.insights.length > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  Toque nas barras para ver detalhes
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">
                Nenhuma tarefa concluída neste período
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileStrategicReviewPage;
