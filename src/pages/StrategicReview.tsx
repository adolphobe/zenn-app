
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useTaskPillars } from '@/context/hooks';
import PeriodTabs from '@/components/strategic-review/PeriodTabs';
import DateRangePicker from '@/components/strategic-review/DateRangePicker';
import AnalysisContent from '@/components/strategic-review/AnalysisContent';
import { useStrategicReviewState } from '@/components/strategic-review/hooks/useStrategicReviewState';
import { useToast } from '@/hooks/use-toast';
import { useTaskDataContext } from '@/context/TaskDataProvider';

// Main Strategic Review Page Component
const StrategicReview: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const { toast } = useToast();
  const isFirstRender = useRef(true);
  
  // Debug logs
  useEffect(() => {
    console.log("StrategicReview: Estado de autenticação =>", isAuthenticated ? "Autenticado" : "Não autenticado");
    console.log("StrategicReview: Total de tarefas completadas =>", completedTasks?.length || 0);

    if (completedTasks && completedTasks.length > 0) {
      console.log("StrategicReview: Há tarefas para análise");
      console.log("StrategicReview: Amostra de tarefas completadas:", 
        completedTasks.slice(0, 3).map(t => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          completedAt: t.completedAt
        }))
      );
    } else {
      console.log("StrategicReview: Sem tarefas para análise");
    }
  }, [isAuthenticated, completedTasks]);
  
  // Use the task pillars hook to ensure all tasks have pillars assigned
  const { assignMissingPillars } = useTaskPillars();
  
  // Use our custom hook for state management
  const {
    period,
    customStartDate,
    customEndDate,
    showCustomDatePicker,
    dateRangeDisplay,
    filteredTasks,
    setCustomStartDate,
    setCustomEndDate,
    handlePeriodChange
  } = useStrategicReviewState(completedTasks || []);

  // Adicionar logs para diagnóstico
  useEffect(() => {
    console.log("StrategicReview: Total de tarefas disponíveis:", completedTasks?.length || 0);
    console.log("StrategicReview: Tarefas filtradas para análise:", filteredTasks?.length || 0);
    console.log("StrategicReview: Período selecionado:", period);
    console.log("StrategicReview: Data range:", dateRangeDisplay);
  }, [completedTasks, filteredTasks, period, dateRangeDisplay]);
  
  useEffect(() => {
    // Ensure all tasks have pillars assigned
    assignMissingPillars();
    console.log("StrategicReview: assignMissingPillars() executado");
    
    // Show a toast to indicate the page is loaded - only on first render
    if (isFirstRender.current) {
      try {
        toast({
          title: "Revisão Estratégica",
          description: completedTasksLoading 
            ? "Carregando suas tarefas concluídas..." 
            : (completedTasks?.length 
              ? "Mostrando análise das tarefas concluídas." 
              : "Nenhuma tarefa concluída encontrada.")
        });
        console.log("StrategicReview: Toast de boas-vindas exibido");
      } catch (error) {
        console.error("Error showing toast:", error);
      }
      isFirstRender.current = false;
    }
  }, [assignMissingPillars, toast, completedTasksLoading, completedTasks]);
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insights das suas tarefas</h1>
        <p className="text-muted-foreground">
          {completedTasksLoading ? "Carregando..." : (
            dateRangeDisplay || "Nenhum período selecionado"
          )}
        </p>
        
        {/* Debug info visible in development */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="p-2 my-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p>Debug: Encontradas {filteredTasks.length} tarefas de {completedTasks?.length || 0} totais.</p>
            <p>Debug: Estado de carregamento: {completedTasksLoading ? 'Carregando' : 'Completo'}</p>
          </div>
        )}
      </div>
      
      <Tabs 
        defaultValue="week" 
        value={period} 
        onValueChange={(value) => handlePeriodChange(value as any)} 
        className="space-y-6"
      >
        <PeriodTabs 
          period={period}
          onPeriodChange={handlePeriodChange}
        />
        
        {/* Custom Date Range Picker */}
        {showCustomDatePicker && (
          <DateRangePicker
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            setCustomStartDate={setCustomStartDate}
            setCustomEndDate={setCustomEndDate}
          />
        )}
        
        {/* Analysis Content */}
        <TabsContent value={period} className="space-y-6">
          <AnalysisContent 
            tasks={filteredTasks} 
            isLoading={completedTasksLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
