
import { useCallback } from 'react';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';
import { useTimeZone } from './useTimeZone';
import { isAfter, isBefore } from 'date-fns';

/**
 * Hook especializado para manipulação de datas de vencimento de tarefas
 */
export function useTaskDueDates() {
  const { currentTimeZone, convertToCurrentTimeZone } = useTimeZone();
  
  /**
   * Verifica se uma tarefa está vencida, considerando o timezone atual
   */
  const isTaskOverdue = useCallback((task: Task): boolean => {
    if (!task.idealDate) return false;
    
    // Converte a data para o timezone atual
    const localDate = convertToCurrentTimeZone(task.idealDate);
    if (!localDate) return false;
    
    // Compara com a data atual
    return dateService.isTaskOverdue(localDate);
  }, [convertToCurrentTimeZone]);
  
  /**
   * Agrupa tarefas por prazo (hoje, próximos dias, futuro, vencidas)
   */
  const groupTasksByDueDate = useCallback((tasks: Task[]) => {
    const now = new Date();
    const today = dateService.startOfDay(now);
    const tomorrow = dateService.addDaysToDate(today, 1);
    const nextWeek = dateService.addDaysToDate(today, 7);
    
    return {
      overdue: tasks.filter(task => !task.completed && isTaskOverdue(task)),
      today: tasks.filter(task => {
        if (task.completed || !task.idealDate) return false;
        const localDate = convertToCurrentTimeZone(task.idealDate);
        if (!localDate) return false;
        return dateService.isSameDate(localDate, today);
      }),
      tomorrow: tasks.filter(task => {
        if (task.completed || !task.idealDate) return false;
        const localDate = convertToCurrentTimeZone(task.idealDate);
        if (!localDate) return false;
        return dateService.isSameDate(localDate, tomorrow);
      }),
      nextWeek: tasks.filter(task => {
        if (task.completed || !task.idealDate) return false;
        const localDate = convertToCurrentTimeZone(task.idealDate);
        if (!localDate) return false;
        const startOfLocalDate = dateService.startOfDay(localDate);
        return startOfLocalDate && 
               isAfter(startOfLocalDate, tomorrow) && 
               isBefore(startOfLocalDate, nextWeek);
      }),
      future: tasks.filter(task => {
        if (task.completed || !task.idealDate) return false;
        const localDate = convertToCurrentTimeZone(task.idealDate);
        if (!localDate) return false;
        const startOfLocalDate = dateService.startOfDay(localDate);
        return startOfLocalDate && isAfter(startOfLocalDate, nextWeek);
      }),
      noDate: tasks.filter(task => !task.completed && !task.idealDate)
    };
  }, [convertToCurrentTimeZone, isTaskOverdue]);
  
  /**
   * Calcula os dias restantes até o prazo de uma tarefa
   */
  const getDaysUntilDue = useCallback((task: Task): number | null => {
    if (!task.idealDate) return null;
    
    const localDate = convertToCurrentTimeZone(task.idealDate);
    if (!localDate) return null;
    
    const today = new Date();
    return dateService.getDaysDifference(localDate, today);
  }, [convertToCurrentTimeZone]);
  
  return {
    isTaskOverdue,
    groupTasksByDueDate,
    getDaysUntilDue,
    currentTimeZone
  };
}

