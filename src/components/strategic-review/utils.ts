
import { PeriodType } from './types';
import { subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
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
    default:
      return [today, today];
  }
};

// Helper to filter tasks by date range
export const filterTasksByDateRange = (tasks: Task[], dateRange: [Date, Date]): Task[] => {
  const [startDate, endDate] = dateRange;
  
  // Start and end date with time set to beginning and end of day
  const startDateTime = new Date(startDate);
  startDateTime.setHours(0, 0, 0, 0);
  
  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);
  
  // Filter completed tasks within the date range
  return tasks.filter(task => {
    // Only include completed tasks
    if (!task.completed || !task.completedAt) return false;
    
    // Check if completion date is within the date range
    const completionDate = new Date(task.completedAt);
    return completionDate >= startDateTime && completionDate <= endDateTime;
  });
};

// Helper function to check if a date is within an interval
export const isWithinInterval = (date: Date, interval: { start: Date, end: Date }): boolean => {
  const { start, end } = interval;
  return date >= start && date <= end;
};
