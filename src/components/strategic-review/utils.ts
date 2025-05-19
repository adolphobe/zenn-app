
import { PeriodType } from './types';
import { subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth, subYears } from 'date-fns';
import { Task } from '@/types';

// Calculate start and end dates based on period
export const getDateRangeByPeriod = (period: PeriodType): [Date, Date] => {
  const today = new Date();
  
  switch (period) {
    case 'today':
      return [today, today];
    case 'yesterday':
      return [subDays(today, 1), subDays(today, 1)];
    case 'week':
      return [startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 })];
    case 'month':
      return [startOfMonth(today), endOfMonth(today)];
    case 'custom':
      // Default to last 30 days if custom
      return [subDays(today, 30), today];
    case 'custom-range':
      // This will be handled separately with explicit date parameters
      return [subDays(today, 30), today];
    case 'all-time':
      // Use a very large range for "all time" - 10 years back to today
      return [subYears(today, 10), today];
    default:
      return [today, today];
  }
};

// Improved version of filterTasksByDateRange to handle potential date issues
export const filterTasksByDateRange = (tasks: Task[], dateRange: [Date, Date]): Task[] => {
  console.log("filterTasksByDateRange: Iniciando filtragem de tarefas");
  
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    console.log("filterTasksByDateRange: Nenhuma tarefa para filtrar");
    return [];
  }

  if (!dateRange || dateRange.length !== 2) {
    console.log("filterTasksByDateRange: Intervalo de datas inválido, retornando todas as tarefas concluídas");
    return tasks.filter(task => task.completed);
  }

  const [startDate, endDate] = dateRange;
  
  console.log(`filterTasksByDateRange: Filtrando tarefas entre ${startDate.toISOString()} e ${endDate.toISOString()}`);
  console.log(`filterTasksByDateRange: Total de tarefas antes da filtragem: ${tasks.length}`);
  
  // Para debug, vamos verificar todas as tarefas que estão sendo filtradas
  tasks.forEach((task, index) => {
    if (task.completed && task.completedAt) {
      const completedDate = task.completedAt instanceof Date ? 
        task.completedAt : 
        new Date(task.completedAt);
        
      console.log(`Tarefa #${index} - "${task.title}" - completedAt: ${completedDate.toISOString()}`);
    } else if (task.completed) {
      console.log(`Tarefa #${index} - "${task.title}" - concluída mas sem data de conclusão`);
    }
  });
  
  // Filtrar somente tarefas concluídas e com data de conclusão
  const result = tasks.filter(task => {
    // Primeiro verificar se a tarefa está concluída
    if (!task.completed) {
      return false;
    }
    
    // Se estamos no modo "all-time", retorne todas as tarefas concluídas
    if (startDate.getFullYear() <= 2015) {
      return true;
    }
    
    // Verificar se tem data de conclusão
    if (!task.completedAt) {
      console.log(`filterTasksByDateRange: Tarefa concluída sem data (${task.title})`);
      return false;
    }
    
    // Garantir que completedAt é um Date
    const completedAt = task.completedAt instanceof Date 
      ? task.completedAt 
      : new Date(task.completedAt);
    
    // Verificar se a data está dentro do intervalo
    const isInRange = completedAt >= startDate && completedAt <= endDate;
    
    if (!isInRange) {
      console.log(`Tarefa "${task.title}" está fora do intervalo, data: ${completedAt.toISOString()}`);
    }
    
    return isInRange;
  });
  
  console.log(`filterTasksByDateRange: Encontradas ${result.length} tarefas no intervalo`);
  return result;
};

// Helper function to check if a date is within an interval
export const isWithinInterval = (date: Date, interval: { start: Date, end: Date }): boolean => {
  const { start, end } = interval;
  return date >= start && date <= end;
};
