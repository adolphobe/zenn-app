
import { Task } from '@/types';
import { format, startOfWeek, startOfMonth, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';

// Timeline grouping function
export const groupTasksByTimeline = (tasks: Task[], periodFilter: string = 'all') => {
  // Log para diagnóstico
  logDateInfo('groupTasksByTimeline', `Agrupando ${tasks.length} tarefas com filtro ${periodFilter}`, new Date());
  
  // If a specific period filter is active (except custom), return all tasks in a single group without timeline labels
  if (periodFilter !== 'all' && periodFilter !== 'custom') {
    return [{
      label: '',  // Empty label means no timeline division header
      tasks: [...tasks]
    }];
  }
  
  // Use the current date with timezone support
  const today = dateService.startOfDay(new Date()) || new Date();
  
  const thisWeekStart = startOfWeek(today, { locale: ptBR });
  const thisMonthStart = startOfMonth(today);
  
  const groups = {
    today: { label: 'Hoje', tasks: [] },
    yesterday: { label: 'Ontem', tasks: [] },
    thisWeek: { label: 'Esta semana', tasks: [] },
    thisMonth: { label: 'Este mês', tasks: [] },
    lastMonth: { label: 'Mês passado', tasks: [] },
    twoMonthsAgo: { label: 'Dois meses atrás', tasks: [] },
    older: { label: 'Anteriores', tasks: [] },
  };
  
  const allTasks = [...tasks]; // Copia para não modificar o original
  
  // Primeiro verificamos se temos tarefas válidas para processar
  if (allTasks.length === 0) {
    console.log('groupTasksByTimeline: Sem tarefas para agrupar');
    return [];
  }
  
  allTasks.forEach(task => {
    // Skip tasks without completedAt
    if (!task.completedAt) {
      logDateInfo('groupTasksByTimeline', 'Skipping task without completedAt', { taskId: task.id, task });
      groups.older.tasks.push(task);  // Colocamos em "older" como fallback
      return;
    }
    
    try {
      // Garantir que completedAt seja um objeto Date válido
      const completedDate = dateService.parseDate(task.completedAt);
      logDateInfo('groupTasksByTimeline', `Parsing date for task ${task.id}`, completedDate);
      
      if (!completedDate) {
        logDateInfo('groupTasksByTimeline', `Invalid date for task ${task.id}, placing in "older"`, task.completedAt);
        groups.older.tasks.push(task);
        return;
      }
      
      // Tenta classificar sem conversões de timezone extras que podem causar problemas
      if (dateService.isToday(completedDate)) {
        groups.today.tasks.push(task);
      } else if (dateService.isYesterday(completedDate)) {
        groups.yesterday.tasks.push(task);
      } else if (completedDate >= thisWeekStart && completedDate < today) {
        groups.thisWeek.tasks.push(task);
      } else if (completedDate >= thisMonthStart && completedDate < thisWeekStart) {
        groups.thisMonth.tasks.push(task);
      } else {
        const monthsDifference = differenceInMonths(today, completedDate);
        
        if (monthsDifference === 1) {
          groups.lastMonth.tasks.push(task);
        } else if (monthsDifference === 2) {
          groups.twoMonthsAgo.tasks.push(task);
        } else {
          groups.older.tasks.push(task);
        }
      }
    } catch (error) {
      console.error("Erro ao processar data de conclusão:", error);
      logDateInfo('groupTasksByTimeline', 'Error processing date', { taskId: task.id, error, completedAt: task.completedAt });
      groups.older.tasks.push(task); // Fallback to "older" if date parsing fails
    }
  });
  
  // Filter out empty groups and return
  const filteredGroups = Object.values(groups).filter(group => group.tasks.length > 0);
  logDateInfo('groupTasksByTimeline', `Retornando ${filteredGroups.length} grupos não vazios`, {
    totalTasks: filteredGroups.reduce((sum, group) => sum + group.tasks.length, 0)
  });
  
  return filteredGroups;
};
