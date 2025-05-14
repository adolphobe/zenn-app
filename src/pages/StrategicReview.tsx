
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, isSameDay } from 'date-fns';
import { PeriodType } from '@/components/strategic-review/types';
import { getDateRangeByPeriod, filterTasksByDateRange } from '@/components/strategic-review/utils';
import TaskSummaryCard from '@/components/strategic-review/TaskSummaryCard';
import PillarsAnalysisCard from '@/components/strategic-review/PillarsAnalysisCard';
import FeedbackAnalysisCard from '@/components/strategic-review/FeedbackAnalysisCard';
import { toast } from '@/hooks/use-toast';
import { useTaskPillars } from '@/context/hooks';

// Main Strategic Review Page Component
const StrategicReview: React.FC = () => {
  const { state } = useAppContext();
  const [period, setPeriod] = useState<PeriodType>('week');
  
  // Use the task pillars hook to ensure all tasks have pillars assigned
  const { assignMissingPillars } = useTaskPillars();
  
  useEffect(() => {
    // Ensure all tasks have pillars assigned
    assignMissingPillars();
    
    // Show a toast to indicate the page is loaded
    toast({
      title: "Revisão Estratégica",
      description: "Mostrando análise das tarefas concluídas."
    });
  }, [assignMissingPillars]);
  
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
    <div className="w-full">
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
        <TabsContent value={period} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskSummaryCard tasks={filteredTasks} />
            <PillarsAnalysisCard tasks={filteredTasks} />
          </div>
          <div className="grid gap-6">
            <FeedbackAnalysisCard tasks={filteredTasks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
