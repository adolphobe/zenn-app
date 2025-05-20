
import React, { useState } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useStrategicReviewState } from '@/components/strategic-review/hooks/useStrategicReviewState';
import { useInsightsAnalysis } from '@/components/strategic-review/hooks/useInsightsAnalysis';
import { useFeedbackAnalysis } from '@/components/strategic-review/hooks/useFeedbackAnalysis';
import PillarInsight from '@/components/strategic-review/components/PillarInsight';
import DateRangePicker from '@/components/strategic-review/DateRangePicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Info } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PeriodType } from '@/components/strategic-review/types';

const MobileStrategicReviewPage = () => {
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
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
  } = useStrategicReviewState(completedTasks);

  const pillarsData = useInsightsAnalysis(filteredTasks);
  const feedbackData = useFeedbackAnalysis(filteredTasks);
  
  // Period options
  const periodOptions = [
    { label: 'Hoje', value: 'today' as PeriodType },
    { label: 'Ontem', value: 'yesterday' as PeriodType },
    { label: 'Esta Semana', value: 'week' as PeriodType },
    { label: 'Este Mês', value: 'month' as PeriodType },
    { label: 'Personalizado', value: 'custom-range' as PeriodType },
    { label: 'Vitalício', value: 'all-time' as PeriodType },
  ];
  
  // Loading states
  if (completedTasksLoading) {
    return (
      <div className="p-4">
        <Alert className="mb-4">
          <AlertDescription>Carregando dados de análise...</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // If no tasks at all
  if (completedTasks.length === 0) {
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

  // Render pillar visualization
  const renderPillarsVisualization = () => {
    return (
      <div className="space-y-3 mt-4">
        {pillarsData.averages.map((pillar) => (
          <div 
            key={pillar.id} 
            className="flex flex-col space-y-1.5"
            onClick={() => setFocusedPillar(pillar.id)}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{pillar.name}</span>
              <span className="text-sm font-medium">{pillar.value.toFixed(1)}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(pillar.value * 20, 100)}%`,
                  backgroundColor: pillar.color 
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render feedback visualization
  const renderFeedbackVisualization = () => {
    if (!feedbackData.withFeedback) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">
            Sem dados de feedback para o período selecionado
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          {feedbackData.distribution.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex-1 flex justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm whitespace-pre-line">
            {feedbackData.insight}
          </p>
        </div>
      </div>
    );
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
      
      {/* Period selector dropdown */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Período: {periodOptions.find(p => p.value === period)?.label}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            {periodOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value} 
                onClick={() => handlePeriodChange(option.value)}
                className={period === option.value ? "bg-muted font-medium" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {showCustomDatePicker && (
          <div className="mt-4">
            <DateRangePicker 
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              setCustomStartDate={setCustomStartDate}
              setCustomEndDate={setCustomEndDate}
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
            
            <div className="bg-muted p-3 rounded-lg text-center relative">
              <div className="flex items-center justify-center">
                <p className="text-xs text-muted-foreground mb-1">Score Médio</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        Este valor é calculado como a média de pontuação total de todas as tarefas 
                        concluídas no período selecionado. A pontuação total de cada tarefa é 
                        a soma das suas três notas: importância, orgulho e evolução.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
          {renderFeedbackVisualization()}
        </CardContent>
      </Card>
      
      {/* Pillar analysis card */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Foco das Suas Tarefas</CardTitle>
            <p className="text-xs text-muted-foreground">
              Toque nas barras abaixo para ver análises detalhadas de cada tipo de foco.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {renderPillarsVisualization()}
              
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

      {/* Average calculation explanation */}
      <div className="text-xs text-muted-foreground px-1">
        <p className="font-medium mb-1">Como as médias são calculadas:</p>
        <p>
          Cada barra representa a média das notas que você deu em cada pilar ao criar suas tarefas:
        </p>
        <ul className="list-disc pl-4 mt-1 space-y-1">
          <li className="text-blue-600">Era importante: média das notas de urgência/importância</li>
          <li className="text-orange-600">Deu orgulho: média das notas de satisfação pessoal</li>
          <li className="text-green-600">Gerou evolução: média das notas de crescimento</li>
        </ul>
      </div>
    </div>
  );
};

export default MobileStrategicReviewPage;
