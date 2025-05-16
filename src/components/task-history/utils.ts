
import { Task } from '@/types';
import { format } from 'date-fns';

// Timeline grouping function
export const groupTasksByTimeline = (tasks: Task[], periodFilter: string = 'all') => {
  // If a specific period filter is active, return all tasks in a single group without timeline labels
  if (periodFilter !== 'all') {
    return [{
      label: '',  // Empty label means no timeline division header
      tasks: [...tasks]
    }];
  }
  
  // Use the current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const groups = {
    today: { label: 'Hoje', tasks: [] },
    yesterday: { label: 'Ontem', tasks: [] },
    thisWeek: { label: 'Esta semana', tasks: [] },
    thisMonth: { label: 'Este mês', tasks: [] },
    older: { label: 'Anteriores', tasks: [] },
  };
  
  tasks.forEach(task => {
    // Skip tasks without completedAt
    if (!task.completedAt) return;
    
    const completedDate = new Date(task.completedAt);
    const completedDateOnly = new Date(
      completedDate.getFullYear(), 
      completedDate.getMonth(), 
      completedDate.getDate()
    );
    
    const todayDate = new Date(
      today.getFullYear(), 
      today.getMonth(), 
      today.getDate()
    );
    
    const yesterdayDate = new Date(
      yesterday.getFullYear(), 
      yesterday.getMonth(), 
      yesterday.getDate()
    );
    
    if (completedDateOnly.getTime() === todayDate.getTime()) {
      groups.today.tasks.push(task);
    } else if (completedDateOnly.getTime() === yesterdayDate.getTime()) {
      groups.yesterday.tasks.push(task);
    } else if (completedDate >= thisWeekStart && completedDate < today) {
      groups.thisWeek.tasks.push(task);
    } else if (completedDate >= thisMonthStart && completedDate < thisWeekStart) {
      groups.thisMonth.tasks.push(task);
    } else {
      groups.older.tasks.push(task);
    }
  });
  
  return Object.values(groups).filter(group => group.tasks.length > 0);
};
