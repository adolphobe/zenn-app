
import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useTaskPillars } from '@/context/hooks';
import PeriodTabs from '@/components/strategic-review/PeriodTabs';
import DateRangePicker from '@/components/strategic-review/DateRangePicker';
import AnalysisContent from '@/components/strategic-review/AnalysisContent';
import { useStrategicReviewState } from '@/components/strategic-review/hooks/useStrategicReviewState';
import { useToast } from '@/hooks/use-toast';

// Main Strategic Review Page Component
const StrategicReview: React.FC = () => {
  const { state } = useAppContext();
  const { isAuthenticated } = useAuth();
  const { toasts, addToast } = useToast(); // Corrigido para usar addToast, não toast diretamente
  const isFirstRender = useRef(true);
  
  // Verificação simples de autenticação
  useEffect(() => {
    console.log("StrategicReview: Estado de autenticação =>", isAuthenticated ? "Autenticado" : "Não autenticado");
  }, [isAuthenticated]);
  
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
  } = useStrategicReviewState(state.tasks);

  // Adicionar logs para diagnóstico
  useEffect(() => {
    console.log("StrategicReview: Total de tarefas disponíveis:", state.tasks.length);
    console.log("StrategicReview: Tarefas filtradas para análise:", filteredTasks.length);
    console.log("StrategicReview: Período selecionado:", period);
    console.log("StrategicReview: Data range:", dateRangeDisplay);
  }, [state.tasks, filteredTasks, period, dateRangeDisplay]);
  
  useEffect(() => {
    // Ensure all tasks have pillars assigned - explicitly call this
    assignMissingPillars();
    console.log("StrategicReview: assignMissingPillars() executado");
    
    // Show a toast to indicate the page is loaded - only on first render
    if (isFirstRender.current) {
      // Use addToast from the hook context
      try {
        addToast({
          title: "Revisão Estratégica",
          description: "Mostrando análise das tarefas concluídas."
        });
        console.log("StrategicReview: Toast de boas-vindas exibido");
      } catch (error) {
        console.error("Error showing toast:", error);
      }
      isFirstRender.current = false;
    }
  }, [assignMissingPillars, addToast]);
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insights das suas tarefas</h1>
        <p className="text-muted-foreground">Período: {dateRangeDisplay || "Carregando..."}</p>
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
          <AnalysisContent tasks={filteredTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
