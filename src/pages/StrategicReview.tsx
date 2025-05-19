
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
  const { addToast } = useToast();
  const isFirstRender = useRef(true);
  
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
    handlePeriodChange,
    taskStats
  } = useStrategicReviewState(completedTasks || []);
  
  useEffect(() => {
    // Ensure all tasks have pillars assigned
    assignMissingPillars();
    
    // Show a toast to indicate the page is loaded - only on first render
    if (isFirstRender.current) {
      try {
        addToast({
          title: "Revisão Estratégica",
          description: completedTasksLoading 
            ? "Carregando suas tarefas concluídas..." 
            : (completedTasks?.length 
              ? "Mostrando análise das tarefas concluídas." 
              : "Nenhuma tarefa concluída encontrada.")
        });
      } catch (error) {
        console.error("Error showing toast:", error);
      }
      isFirstRender.current = false;
    }
  }, [assignMissingPillars, addToast, completedTasksLoading, completedTasks]);
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insights das suas tarefas</h1>
        <p className="text-muted-foreground">
          {completedTasksLoading ? "Carregando..." : (
            dateRangeDisplay || "Nenhum período selecionado"
          )}
        </p>
        
        {/* Task Statistics Summary */}
        {taskStats && !completedTasksLoading && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">{taskStats.totalFilteredTasks}</span> tarefas concluídas 
            {period !== 'all-time' ? ' no período selecionado' : ''} 
            {' '}de um total de <span className="font-medium">{taskStats.totalCompletedTasks}</span>
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
