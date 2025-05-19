
import { useState, useMemo, useEffect } from 'react';
import { PeriodType } from '../types';
import { getDateRangeByPeriod } from '../utils';
import { format, isSameDay, startOfDay, endOfDay, subDays, isValid } from 'date-fns';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';

// Interface for task statistics
interface TaskStats {
  totalCompletedTasks: number;
  totalFilteredTasks: number;
}

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
    const completedTotal = tasks?.filter(t => t.completed)?.length || 0;
    
    console.log(`useStrategicReviewState: ${completedTotal} tarefas concluídas no total`);
    console.log(`useStrategicReviewState: ${completedWithDate} tarefas concluídas com data de conclusão`);
    
    // Log das primeiras 3 tarefas para debugging
    if (tasks?.length > 0) {
      tasks.slice(0, 3).forEach((task, idx) => {
        console.log(`Task #${idx+1} debug:`, {
          id: task.id,
          title: task.title,
          completedAt: task.completedAt ? 
            (task.completedAt instanceof Date ? 
              task.completedAt.toISOString() : 
              String(task.completedAt)
            ) : 'null',
          completed: task.completed
        });
      });
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
        setCustomStartDate(subDays(today, 7));
        setCustomEndDate(today);
      }
    }
  }, [period]);
  
  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    if (period === 'custom-range' && customStartDate && customEndDate) {
      // Ensure both dates are valid
      if (isValid(customStartDate) && isValid(customEndDate)) {
        return [startOfDay(customStartDate), endOfDay(customEndDate)] as [Date, Date];
      }
    }
    
    // Use helper function to calculate range
    const range = getDateRangeByPeriod(period);
    console.log(`useStrategicReviewState: Calculado intervalo para ${period}:`, 
      range[0].toISOString(), "até", range[1].toISOString());
    return range;
  }, [period, customStartDate, customEndDate]);
  
  // Log do intervalo de datas calculado
  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      console.log(`useStrategicReviewState: Intervalo de datas: ${dateRange[0].toISOString()} até ${dateRange[1].toISOString()}`);
    }
  }, [dateRange]);
  
  // Function to safely convert any value to a Date object
  const toSafeDate = (value: any): Date | null => {
    if (!value) return null;
    
    try {
      // If already a Date object
      if (value instanceof Date && isValid(value)) {
        return value;
      }
      
      // Try to parse string or timestamp
      const parsed = dateService.parseDate(value);
      if (parsed && isValid(parsed)) {
        return parsed;
      }
      
      console.warn("useStrategicReviewState: Valor de data inválido:", value);
      return null;
    } catch (error) {
      console.error("useStrategicReviewState: Erro ao converter data:", error);
      return null;
    }
  };
  
  // Filter tasks based on date range with improved handling
  const filteredTasks = useMemo(() => {
    const tasksSafe = Array.isArray(tasks) ? tasks : [];
    
    if (tasksSafe.length === 0) {
      console.log("useStrategicReviewState: Nenhuma tarefa disponível para filtragem");
      return [];
    }
    
    console.log(`useStrategicReviewState: Filtrando ${tasksSafe.length} tarefas por data...`);
    
    // For "all-time" period, include all completed tasks, ignoring dates
    if (period === 'all-time') {
      const allCompletedTasks = tasksSafe.filter(t => t.completed);
      console.log(`useStrategicReviewState: Modo 'Todo o Tempo' - Retornando ${allCompletedTasks.length} tarefas concluídas`);
      return allCompletedTasks;
    }
    
    // Filter completed tasks with valid completedAt dates within the range
    const filtered = tasksSafe.filter(task => {
      if (!task.completed) {
        return false;
      }
      
      // Handle tasks without completion date - exclude from filtered results
      if (!task.completedAt) {
        return false;
      }
      
      try {
        // Convert to Date object safely
        const completedDate = toSafeDate(task.completedAt);
        if (!completedDate) return false;
        
        // Check if within range
        const isAfterStart = completedDate >= dateRange[0];
        const isBeforeEnd = completedDate <= dateRange[1];
        
        return isAfterStart && isBeforeEnd;
      } catch (error) {
        console.error("useStrategicReviewState: Erro ao filtrar tarefa por data:", error);
        return false;
      }
    });
    
    console.log(`useStrategicReviewState: Filtrado ${filtered.length} de ${tasksSafe.length} tarefas para análise`);
    
    // Detailed debug for filtering issues
    if (filtered.length === 0 && tasksSafe.filter(t => t.completed).length > 0) {
      console.warn("useStrategicReviewState: ALERTA - Nenhuma tarefa filtrada apesar de existirem tarefas concluídas.");
      console.log("useStrategicReviewState: Verificando se as tarefas concluídas têm datas válidas.");
      
      tasksSafe.filter(t => t.completed).slice(0, 5).forEach((task, idx) => {
        const completedDate = toSafeDate(task.completedAt);
        
        console.log(`Tarefa #${idx + 1}: "${task.title}"`, {
          concluída: task.completed,
          dataOriginal: task.completedAt,
          dataParsed: completedDate ? completedDate.toISOString() : 'null'
        });
        
        if (completedDate) {
          const isInRange = completedDate >= dateRange[0] && completedDate <= dateRange[1];
          console.log(`  - Está no intervalo? ${isInRange}`, {
            dataInício: dateRange[0].toISOString(),
            dataFim: dateRange[1].toISOString()
          });
        }
      });
    }
    
    return filtered;
  }, [tasks, dateRange, period]);
  
  // Calculate task statistics
  const taskStats = useMemo<TaskStats>(() => {
    const totalCompletedTasks = tasks?.filter(t => t.completed)?.length || 0;
    const totalFilteredTasks = filteredTasks?.length || 0;
    
    return {
      totalCompletedTasks,
      totalFilteredTasks
    };
  }, [tasks, filteredTasks]);
  
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
    
    if (period === 'all-time') {
      return 'Todo o Tempo';
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
    taskStats,
    setCustomStartDate,
    setCustomEndDate,
    handlePeriodChange
  };
};
