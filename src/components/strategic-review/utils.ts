import { PeriodType } from './types';
import { subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
import { Task } from '@/types';

// Calculate start and end dates based on period
export const getDateRangeByPeriod = (period: PeriodType): [Date, Date] => {
  const today = new Date();
  
  switch (period) {
    case 'today':
      return [today, today];
    case 'week':
      return [startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 })];
    case 'month':
      return [startOfMonth(today), endOfMonth(today)];
    case 'custom':
      // Default to last 30 days if custom
      return [subDays(today, 30), today];
    default:
      return [today, today];
  }
};

// Helper to filter tasks by date range
export const filterTasksByDateRange = (tasks: Task[], dateRange: [Date, Date]): Task[] => {
  const [startDate, endDate] = dateRange;
  
  // Filter completed tasks within the date range
  // If the task has an idealDate, check if it's within the range
  // Otherwise, include all completed tasks
  return tasks.filter(task => {
    if (!task.completed) return false;
    
    // If task has idealDate, check if it's within range
    if (task.idealDate) {
      const taskDate = new Date(task.idealDate);
      return isWithinInterval(taskDate, { start: startDate, end: endDate });
    }
    
    // Include tasks without idealDate as they might still be relevant
    return true;
  });
};

// Helper function to check if a date is within an interval
export const isWithinInterval = (date: Date, interval: { start: Date, end: Date }): boolean => {
  const { start, end } = interval;
  return date >= start && date <= end;
};
