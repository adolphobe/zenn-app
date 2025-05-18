
import { useState, useMemo, useEffect } from 'react';
import { PeriodType } from '../types';
import { getDateRangeByPeriod, filterTasksByDateRange } from '../utils';
import { format, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { Task } from '@/types';

export const useStrategicReviewState = (tasks: Task[]) => {
  const [period, setPeriod] = useState<PeriodType>('week');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  // Log inicial das tarefas recebidas
  useEffect(() => {
    console.log("useStrategicReviewState: Total de tarefas recebidas:", tasks?.length || 0);
    
    // Log detalhado para verificar se as tarefas possuem dados de conclusão
    const completedWithDate = tasks?.filter(t => t.completed && t.completedAt)?.length || 0;
    console.log(`useStrategicReviewState: ${completedWithDate} tarefas concluídas com data de conclusão`);
    
    if (tasks?.length > 0 && completedWithDate === 0) {
      console.warn("useStrategicReviewState: ALERTA - Tarefas sem datas de conclusão podem não aparecer na análise");
    }
  }, [tasks]);
  
  // Reset custom dates when changing to a non-custom period
  useEffect(() => {
    console.log("useStrategicReviewState: Período alterado para:", period);
    
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
  
  // Log do intervalo de datas calculado
  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      console.log(`useStrategicReviewState: Intervalo de datas: ${dateRange[0].toISOString()} até ${dateRange[1].toISOString()}`);
    }
  }, [dateRange]);
  
  // Filter tasks based on date range
  const filteredTasks = useMemo(() => {
    const tasksSafe = Array.isArray(tasks) ? tasks : [];
    const filtered = filterTasksByDateRange(tasksSafe, dateRange);
    
    console.log(`useStrategicReviewState: Filtrado ${filtered.length} de ${tasksSafe.length} tarefas para análise`);
    
    // Log detalhado sobre as tarefas filtradas
    if (filtered.length === 0 && tasksSafe.length > 0) {
      console.warn("useStrategicReviewState: ALERTA - Nenhuma tarefa filtrada apesar de existirem tarefas. Verificando datas:");
      
      const completedTasks = tasksSafe.filter(t => t.completed);
      console.log(`useStrategicReviewState: Total de tarefas concluídas: ${completedTasks.length}`);
      
      completedTasks.forEach((task, idx) => {
        if (idx < 5) { // Limita o log às primeiras 5 tarefas
          console.log(`Tarefa #${idx + 1}: "${task.title}" - Concluída: ${task.completed}, Data: ${task.completedAt}`);
        }
      });
    }
    
    return filtered;
  }, [tasks, dateRange]);
  
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

  // Handler for period changes
  const handlePeriodChange = (newPeriod: PeriodType) => {
    console.log("useStrategicReviewState: Alterando período para:", newPeriod);
    setPeriod(newPeriod);
  };
  
  return {
    period,
    customStartDate,
    customEndDate,
    showCustomDatePicker,
    dateRangeDisplay,
    filteredTasks,
    setCustomStartDate,
    setCustomEndDate,
    handlePeriodChange
  };
};
