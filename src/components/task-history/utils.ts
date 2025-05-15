
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { Task } from '@/types';

// Group tasks by time period (today, this week, this month, this year, older)
export const groupTasksByTimeline = (tasks: Task[]) => {
  const groups: { title: string; tasks: Task[]; invisible?: boolean }[] = [];
  
  // Today's tasks
  const todayTasks = tasks.filter(task => task.completedAt && isToday(new Date(task.completedAt)));
  if (todayTasks.length > 0) {
    groups.push({ 
      title: `Hoje (${todayTasks.length})`, 
      tasks: todayTasks,
      invisible: true // Add invisible property for today's tasks
    });
  }
  
  // This week's tasks (excluding today)
  const thisWeekTasks = tasks.filter(task => 
    task.completedAt && 
    isThisWeek(new Date(task.completedAt)) && 
    !isToday(new Date(task.completedAt))
  );
  if (thisWeekTasks.length > 0) {
    groups.push({ 
      title: `Esta semana (${thisWeekTasks.length})`, 
      tasks: thisWeekTasks,
      invisible: true // Add invisible property for this week's tasks
    });
  }
  
  // This month's tasks (excluding this week)
  const thisMonthTasks = tasks.filter(task => 
    task.completedAt && 
    isThisMonth(new Date(task.completedAt)) && 
    !isThisWeek(new Date(task.completedAt))
  );
  if (thisMonthTasks.length > 0) {
    groups.push({ 
      title: `Este mês (${thisMonthTasks.length})`, 
      tasks: thisMonthTasks,
      invisible: true // Add invisible property for this month's tasks
    });
  }
  
  // This year's tasks (excluding this month)
  const thisYearTasks = tasks.filter(task => 
    task.completedAt && 
    isThisYear(new Date(task.completedAt)) && 
    !isThisMonth(new Date(task.completedAt))
  );
  if (thisYearTasks.length > 0) {
    groups.push({ 
      title: `Este ano (${thisYearTasks.length})`, 
      tasks: thisYearTasks,
      invisible: true // Add invisible property for this year's tasks
    });
  }
  
  // Older tasks
  const olderTasks = tasks.filter(task => 
    task.completedAt && 
    !isThisYear(new Date(task.completedAt))
  );
  if (olderTasks.length > 0) {
    groups.push({ 
      title: `Mais antigos (${olderTasks.length})`, 
      tasks: olderTasks,
      invisible: true // Add invisible property for older tasks
    });
  }
  
  return groups;
};
