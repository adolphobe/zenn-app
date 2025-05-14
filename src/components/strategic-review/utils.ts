
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
  
  return tasks.filter(task => 
    task.completed && 
    task.idealDate && 
    isWithinInterval(new Date(task.idealDate), { 
      start: new Date(startDate),
      end: new Date(endDate)
    })
  );
};

// Helper function to check if a date is within an interval
export const isWithinInterval = (date: Date, interval: { start: Date, end: Date }): boolean => {
  const { start, end } = interval;
  return date >= start && date <= end;
};
