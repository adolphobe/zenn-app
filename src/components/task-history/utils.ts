
import { Task } from '@/types';
import { format } from 'date-fns';

// Timeline grouping function
export const groupTasksByTimeline = (tasks: Task[]) => {
  // Using May 16, 2024 as the reference "today" date
  const today = new Date(2024, 4, 16);
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
    completedDate.setHours(0, 0, 0, 0);
    
    if (completedDate.getTime() === today.getTime()) {
      groups.today.tasks.push(task);
    } else if (completedDate.getTime() === yesterday.getTime()) {
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
