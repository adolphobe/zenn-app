
import { Task } from '@/types';
import { format, isToday, isYesterday, startOfWeek, startOfMonth, parseISO, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Timeline grouping function
export const groupTasksByTimeline = (tasks: Task[], periodFilter: string = 'all') => {
  // If a specific period filter is active (except custom), return all tasks in a single group without timeline labels
  if (periodFilter !== 'all' && periodFilter !== 'custom') {
    return [{
      label: '',  // Empty label means no timeline division header
      tasks: [...tasks]
    }];
  }
  
  // Use the current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
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
  
  tasks.forEach(task => {
    // Skip tasks without completedAt
    if (!task.completedAt) return;
    
    try {
      const completedDate = parseISO(task.completedAt);
      
      if (isToday(completedDate)) {
        groups.today.tasks.push(task);
      } else if (isYesterday(completedDate)) {
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
      groups.older.tasks.push(task); // Fallback to "older" if date parsing fails
    }
  });
  
  // Filter out empty groups and return
  return Object.values(groups).filter(group => group.tasks.length > 0);
};
