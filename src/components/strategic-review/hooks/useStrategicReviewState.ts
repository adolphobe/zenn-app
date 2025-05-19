
import { useState, useMemo, useEffect } from 'react';
import { PeriodType } from '../types';
import { getDateRangeByPeriod, filterTasksByDateRange } from '../utils';
import { format, isSameDay, startOfDay, endOfDay, subDays } from 'date-fns';
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
    const completedTotal = tasks?.filter(t => t.completed)?.length || 0;
    
    console.log(`useStrategicReviewState: ${completedTotal} tarefas concluídas no total`);
    console.log(`useStrategicReviewState: ${completedWithDate} tarefas concluídas com data de conclusão`);
    
    // Log das primeiras 3 tarefas para debugging
    if (tasks?.length > 0) {
      tasks.slice(0, 3).forEach((task, idx) => {
        console.log(`Task #${idx+1} debug: id=${task.id}, title=${task.title}, completedAt=${task.completedAt ? (task.completedAt instanceof Date ? task.completedAt.toISOString() : task.completedAt) : 'null'}, completed=${task.completed}`);
      });
    }
    
    if (completedTotal > 0 && completedWithDate === 0) {
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
    
    // Usar função auxiliar para calcular intervalo
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
  
  // Filter tasks based on date range with improved debugging
  const filteredTasks = useMemo(() => {
    const tasksSafe = Array.isArray(tasks) ? tasks : [];
    
    if (tasksSafe.length === 0) {
      console.log("useStrategicReviewState: Nenhuma tarefa disponível para filtragem");
      return [];
    }
    
    console.log(`useStrategicReviewState: Filtrando ${tasksSafe.length} tarefas por data...`);
    console.log(`useStrategicReviewState: Total de tarefas concluídas: ${tasksSafe.filter(t => t.completed).length}`);
    
    // Verificação adicional: converter para o formato esperado se necessário
    const tasksWithDates = tasksSafe.map(task => {
      // Certifique-se de que completedAt é um objeto Date válido quando a tarefa está concluída
      if (task.completed && task.completedAt) {
        // Se já for um Date, mantenha. Se for string, converta para Date
        const completedAtDate = task.completedAt instanceof Date 
          ? task.completedAt 
          : new Date(task.completedAt);
        
        return { ...task, completedAt: completedAtDate };
      }
      return task;
    });
    
    // DIAGNÓSTICO: Verificar se existem tarefas concluídas e se suas datas são válidas
    const completedTasks = tasksWithDates.filter(t => t.completed);
    console.log(`useStrategicReviewState: Total de tarefas concluídas (após map): ${completedTasks.length}`);
    
    if (completedTasks.length > 0) {
      completedTasks.slice(0, 3).forEach((task, idx) => {
        const dateVal = task.completedAt ? 
          (task.completedAt instanceof Date ? task.completedAt.toISOString() : task.completedAt) : 
          'undefined';
        console.log(`Tarefa concluída #${idx+1}: "${task.title}", completedAt: ${dateVal}, válida: ${!!task.completedAt}`);
      });
    }
    
    // Para o período "all-time", incluir todas as tarefas concluídas, ignorando datas
    if (period === 'all-time') {
      const allCompletedTasks = tasksWithDates.filter(t => t.completed);
      console.log(`useStrategicReviewState: Modo 'Todo o Tempo' - Retornando ${allCompletedTasks.length} tarefas concluídas`);
      return allCompletedTasks;
    }
    
    // Usar a função normal de filtragem para outros períodos
    const filtered = filterTasksByDateRange(tasksWithDates, dateRange);
    
    console.log(`useStrategicReviewState: Filtrado ${filtered.length} de ${tasksWithDates.length} tarefas para análise`);
    
    // Log detalhado sobre as tarefas filtradas
    if (filtered.length === 0 && completedTasks.length > 0) {
      console.warn("useStrategicReviewState: ALERTA - Nenhuma tarefa filtrada apesar de existirem tarefas concluídas.");
      console.log("useStrategicReviewState: Verificando se as tarefas concluídas têm datas válidas.");
      
      completedTasks.forEach((task, idx) => {
        if (idx < 5) { // Limita o log às primeiras 5 tarefas
          const completedDate = task.completedAt ? 
            (task.completedAt instanceof Date ? task.completedAt : new Date(task.completedAt)) : 
            null;
            
          console.log(`Tarefa #${idx + 1}: "${task.title}" - Concluída: ${task.completed}, Data: ${completedDate ? completedDate.toISOString() : 'null'}`);
          
          if (completedDate) {
            const isInRange = completedDate >= dateRange[0] && completedDate <= dateRange[1];
            console.log(`  - Está no intervalo? ${isInRange}, Intervalo: ${dateRange[0].toISOString()} até ${dateRange[1].toISOString()}`);
          }
        }
      });
    }
    
    return filtered;
  }, [tasks, dateRange, period]);
  
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
    setCustomStartDate,
    setCustomEndDate,
    handlePeriodChange
  };
};
