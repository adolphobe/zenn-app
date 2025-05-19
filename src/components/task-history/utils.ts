
import { Task } from '@/types';
import { startOfWeek, startOfMonth, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';

// Cached values to prevent recalculations
const today = dateService.startOfDay(new Date()) || new Date();
const thisWeekStart = startOfWeek(today, { locale: ptBR });
const thisMonthStart = startOfMonth(today);

// Timeline grouping function - optimized for performance
export const groupTasksByTimeline = (tasks: Task[], periodFilter: string = 'all') => {
  // Early exit if no tasks, prevent further processing
  if (!tasks || tasks.length === 0) {
    return [];
  }
  
  // If a specific period filter is active (except custom), return all tasks in a single group
  if (periodFilter !== 'all' && periodFilter !== 'custom') {
    return [{
      label: '',  // Empty label means no timeline division header
      tasks: [...tasks]
    }];
  }
  
  const groups = {
    today: { label: 'Hoje', tasks: [] as Task[] },
    yesterday: { label: 'Ontem', tasks: [] as Task[] },
    thisWeek: { label: 'Esta semana', tasks: [] as Task[] },
    thisMonth: { label: 'Este mês', tasks: [] as Task[] },
    lastMonth: { label: 'Mês passado', tasks: [] as Task[] },
    twoMonthsAgo: { label: 'Dois meses atrás', tasks: [] as Task[] },
    older: { label: 'Anteriores', tasks: [] as Task[] },
  };
  
  const allTasks = [...tasks]; // Defensive copy
  
  allTasks.forEach(task => {
    // Skip tasks without completedAt
    if (!task.completedAt) {
      groups.older.tasks.push(task);  // Place in "older" as fallback
      return;
    }
    
    try {
      // Parse date only once - reuse the result
      const completedDate = task.completedAt instanceof Date ? 
        task.completedAt : 
        dateService.parseDate(task.completedAt);
      
      if (!completedDate) {
        groups.older.tasks.push(task);
        return;
      }
      
      // Group tasks by date - simplified logic with fewer calculations
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
      // Fallback to "older" if date processing fails
      groups.older.tasks.push(task);
    }
  });
  
  // Filter out empty groups and return
  return Object.values(groups).filter(group => group.tasks.length > 0);
};
