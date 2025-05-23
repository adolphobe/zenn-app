
import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useTaskPillars } from '@/context/hooks';
import PeriodTabs from '@/components/strategic-review/PeriodTabs';
import DateRangePicker from '@/components/strategic-review/DateRangePicker';
import AnalysisContent from '@/components/strategic-review/AnalysisContent';
import { useStrategicReviewState } from '@/components/strategic-review/hooks/useStrategicReviewState';
import { useToast } from '@/hooks/use-toast';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logDiagnostics } from '@/utils/diagnosticLog';
import { NavigationStore } from '@/utils/navigationStore';

// Main Strategic Review Page Component
const StrategicReview: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { completedTasks, completedTasksLoading, forceSynchronize } = useTaskDataContext();
  const { addToast } = useToast();
  const isFirstRender = useRef(true);
  
  // Use the task pillars hook to ensure all tasks have pillars assigned
  const { assignMissingPillars } = useTaskPillars();
  
  // Record this page visit for navigation optimization
  useEffect(() => {
    NavigationStore.addRecentRoute('/strategic-review');
    NavigationStore.setNavigationType('external');
  }, []);
  
  // Log for diagnosis
  useEffect(() => {
    logDiagnostics('StrategicReview', 
      `Page rendered with ${completedTasks?.length || 0} completed tasks, loading: ${completedTasksLoading}`);
  }, [completedTasks, completedTasksLoading]);
  
  // Force refresh data when the page loads
  const refreshData = useCallback(async () => {
    if (isAuthenticated) {
      logDiagnostics('StrategicReview', 'Forcing data synchronization');
      try {
        await forceSynchronize();
        logDiagnostics('StrategicReview', 'Data synchronization completed');
      } catch (err) {
        console.error('Failed to synchronize data:', err);
      }
    }
  }, [forceSynchronize, isAuthenticated]);
  
  useEffect(() => {
    refreshData();
    
    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(() => {
      logDiagnostics('StrategicReview', 'Performing periodic data refresh');
      refreshData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshData]);
  
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
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <TabsContent value={period} className="space-y-6">
            <AnalysisContent 
              tasks={filteredTasks} 
              isLoading={completedTasksLoading} 
            />
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
};

export default StrategicReview;
