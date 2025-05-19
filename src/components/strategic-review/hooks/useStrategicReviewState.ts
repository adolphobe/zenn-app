
import { useState, useMemo, useEffect } from 'react';
import { PeriodType } from '../types';
import { getDateRangeByPeriod } from '../utils';
import { format, isSameDay, startOfDay, endOfDay, subDays, isValid } from 'date-fns';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';

// Interface for task statistics
interface TaskStats {
  totalCompletedTasks: number;
  totalFilteredTasks: number;
}

export const useStrategicReviewState = (tasks: Task[]) => {
  const [period, setPeriod] = useState<PeriodType>('week');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  // Reset custom dates when changing to a non-custom period
  useEffect(() => {    
    if (period !== 'custom-range') {
      setShowCustomDatePicker(false);
    } else {
      setShowCustomDatePicker(true);
      // Initialize with last 7 days if not set
      if (!customStartDate) {
        const today = new Date();
        setCustomStartDate(subDays(today, 7));
        setCustomEndDate(today);
      }
    }
  }, [period]);
  
  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    if (period === 'custom-range' && customStartDate && customEndDate) {
      // Ensure both dates are valid
      if (isValid(customStartDate) && isValid(customEndDate)) {
        return [startOfDay(customStartDate), endOfDay(customEndDate)] as [Date, Date];
      }
    }
    
    // Use helper function to calculate range
    const range = getDateRangeByPeriod(period);
    return range;
  }, [period, customStartDate, customEndDate]);
  
  // Function to safely convert any value to a Date object
  const toSafeDate = (value: any): Date | null => {
    if (!value) return null;
    
    try {
      // If already a Date object
      if (value instanceof Date && isValid(value)) {
        return value;
      }
      
      // Try to parse string or timestamp
      const parsed = dateService.parseDate(value);
      if (parsed && isValid(parsed)) {
        return parsed;
      }
      
      return null;
    } catch (error) {
      console.error("useStrategicReviewState: Erro ao converter data:", error);
      return null;
    }
  };
  
  // Filter tasks based on date range with improved handling
  const filteredTasks = useMemo(() => {
    const tasksSafe = Array.isArray(tasks) ? tasks : [];
    
    if (tasksSafe.length === 0) {
      return [];
    }
    
    // For "all-time" period, include all completed tasks, ignoring dates
    if (period === 'all-time') {
      return tasksSafe.filter(t => t.completed);
    }
    
    // Filter completed tasks with valid completedAt dates within the range
    return tasksSafe.filter(task => {
      if (!task.completed) {
        return false;
      }
      
      // Handle tasks without completion date - exclude from filtered results
      if (!task.completedAt) {
        return false;
      }
      
      try {
        // Convert to Date object safely
        const completedDate = toSafeDate(task.completedAt);
        if (!completedDate) return false;
        
        // Check if within range
        return completedDate >= dateRange[0] && completedDate <= dateRange[1];
      } catch (error) {
        return false;
      }
    });
  }, [tasks, dateRange, period]);
  
  // Calculate task statistics
  const taskStats = useMemo<TaskStats>(() => {
    const totalCompletedTasks = tasks?.filter(t => t.completed)?.length || 0;
    const totalFilteredTasks = filteredTasks?.length || 0;
    
    return {
      totalCompletedTasks,
      totalFilteredTasks
    };
  }, [tasks, filteredTasks]);
  
  // Format date range for display
  const dateRangeDisplay = useMemo(() => {
    const [start, end] = dateRange;
    
    if (period === 'today') {
      return `Hoje (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (period === 'yesterday') {
      return `Ontem (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (period === 'custom-range' && customStartDate && customEndDate) {
      return `${format(customStartDate, 'dd/MM/yyyy')} - ${format(customEndDate, 'dd/MM/yyyy')}`;
    }
    
    if (period === 'all-time') {
      return 'Todo o Tempo';
    }
    
    if (isSameDay(start, end)) {
      return format(start, 'dd/MM/yyyy');
    }
    
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  }, [dateRange, period, customStartDate, customEndDate]);

  // Handler for period changes
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
  };
  
  return {
    period,
    customStartDate,
    customEndDate,
    showCustomDatePicker,
    dateRangeDisplay,
    filteredTasks,
    taskStats,
    setCustomStartDate,
    setCustomEndDate,
    handlePeriodChange
  };
};
