
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { PeriodType } from '@/components/strategic-review/types';
import { getDateRangeByPeriod, filterTasksByDateRange } from '@/components/strategic-review/utils';
import TaskSummaryCard from '@/components/strategic-review/TaskSummaryCard';
import PillarsAnalysisCard from '@/components/strategic-review/PillarsAnalysisCard';
import FeedbackAnalysisCard from '@/components/strategic-review/FeedbackAnalysisCard';
import { toast } from '@/hooks/use-toast';
import { useTaskPillars } from '@/context/hooks';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';

// Main Strategic Review Page Component
const StrategicReview: React.FC = () => {
  const { state } = useAppContext();
  const { isAuthenticated } = useAuth();
  const [period, setPeriod] = useState<PeriodType>('week');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  // Verificação simples de autenticação
  useEffect(() => {
    console.log("StrategicReview: Estado de autenticação =>", isAuthenticated ? "Autenticado" : "Não autenticado");
  }, [isAuthenticated]);
  
  // Use the task pillars hook to ensure all tasks have pillars assigned
  const { assignMissingPillars } = useTaskPillars();
  
  useEffect(() => {
    // Ensure all tasks have pillars assigned - explicitly call this
    assignMissingPillars();
    
    // Show a toast to indicate the page is loaded
    toast({
      title: "Revisão Estratégica",
      description: "Mostrando análise das tarefas concluídas."
    });
  }, [assignMissingPillars]);
  
  // Reset custom dates when changing to a non-custom period
  useEffect(() => {
    if (period !== 'custom-range') {
      setShowCustomDatePicker(false);
    } else {
      setShowCustomDatePicker(true);
      // Initialize with last 7 days if not set
      if (!customStartDate) {
        const today = new Date();
        setCustomStartDate(new Date(today.setDate(today.getDate() - 7)));
        setCustomEndDate(new Date());
      }
    }
  }, [period]);
  
  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    if (period === 'custom-range' && customStartDate && customEndDate) {
      return [startOfDay(customStartDate), endOfDay(customEndDate)] as [Date, Date];
    }
    return getDateRangeByPeriod(period);
  }, [period, customStartDate, customEndDate]);
  
  // Filter tasks based on date range
  const filteredTasks = useMemo(() => {
    const filtered = filterTasksByDateRange(state.tasks, dateRange);
    console.log(`Filtered ${filtered.length} completed tasks for analysis`);
    return filtered;
  }, [state.tasks, dateRange]);
  
  // Format date range for display
  const dateRangeDisplay = useMemo(() => {
    const [start, end] = dateRange;
    
    if (period === 'today') {
      return `Hoje (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (period === 'yesterday') {
      return `Ontem (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (period === 'custom-range' && customStartDate && customEndDate) {
      return `${format(customStartDate, 'dd/MM/yyyy')} - ${format(customEndDate, 'dd/MM/yyyy')}`;
    }
    
    if (isSameDay(start, end)) {
      return format(start, 'dd/MM/yyyy');
    }
    
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  }, [dateRange, period, customStartDate, customEndDate]);

  const hasCompletedTasks = filteredTasks.length > 0;
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insights das suas tarefas</h1>
        <p className="text-muted-foreground">Período: {dateRangeDisplay}</p>
      </div>
      
      <Tabs defaultValue="week" value={period} onValueChange={(value) => setPeriod(value as PeriodType)} className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="yesterday">Ontem</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="month">Este Mês</TabsTrigger>
          <TabsTrigger value="custom">Últimos 30 dias</TabsTrigger>
          <TabsTrigger value="custom-range">Personalizado</TabsTrigger>
        </TabsList>
        
        {/* Custom Date Range Picker */}
        {showCustomDatePicker && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Data inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[200px] justify-start text-left font-normal",
                      !customStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customStartDate ? format(customStartDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Data final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[200px] justify-start text-left font-normal",
                      !customEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    disabled={(date) => 
                      customStartDate ? date < customStartDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="mb-0.5"
                variant="secondary" 
                onClick={() => {
                  if (!customStartDate || !customEndDate) {
                    toast({
                      title: "Datas inválidas",
                      description: "Por favor, selecione ambas as datas.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  if (customEndDate < customStartDate) {
                    toast({
                      title: "Intervalo inválido",
                      description: "A data final deve ser posterior à data inicial.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  // Refresh will happen based on the dateRange calculation
                  toast({
                    title: "Filtro aplicado",
                    description: `Mostrando dados de ${format(customStartDate, 'dd/MM/yyyy')} a ${format(customEndDate, 'dd/MM/yyyy')}`
                  });
                }}
              >
                <CalendarRange className="h-4 w-4 mr-2" />
                Aplicar intervalo
              </Button>
            </div>
          </div>
        )}
        
        {/* Single TabsContent that updates based on the filter */}
        <TabsContent value={period} className="space-y-6">
          <TaskSummaryCard tasks={filteredTasks} />
          
          {/* Only show analysis cards if there are tasks */}
          {hasCompletedTasks && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Making each card have the same height with matching flex */}
              <div className="flex">
                <FeedbackAnalysisCard tasks={filteredTasks} />
              </div>
              
              {/* Right column */}
              <div className="flex">
                <PillarsAnalysisCard tasks={filteredTasks} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
