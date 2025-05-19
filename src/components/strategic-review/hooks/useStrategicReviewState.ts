import { useState, useMemo, useEffect } from 'react';
import { PeriodType } from '../types';
import { getDateRangeByPeriod } from '../utils';
import { format, isSameDay, startOfDay, endOfDay, subDays, isValid } from 'date-fns';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';

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
  
  // Log tasks received for diagnosis
  useEffect(() => {
    logDiagnostics('useStrategicReviewState', `Received ${tasks?.length || 0} tasks`);
    
    // Log details of each task for diagnosis
    if (tasks?.length) {
      tasks.forEach(task => {
        logDateInfo(
          'useStrategicReviewState', 
          `Task ${task.id} (${task.title})`, 
          task.completedAt
        );
      });
    }
  }, [tasks]);
  
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
        const range = [startOfDay(customStartDate), endOfDay(customEndDate)] as [Date, Date];
        logDiagnostics('useStrategicReviewState', 'Custom date range', range);
        return range;
      }
    }
    
    // Use helper function to calculate range
    const range = getDateRangeByPeriod(period);
    logDiagnostics('useStrategicReviewState', `Date range for period ${period}`, range);
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
  
  // Filter tasks based on date range with improved handling and diagnostic logs
  const filteredTasks = useMemo(() => {
    const tasksSafe = Array.isArray(tasks) ? tasks : [];
    
    if (tasksSafe.length === 0) {
      logDiagnostics('useStrategicReviewState', 'No tasks to filter');
      return [];
    }
    
    // For "all-time" period, include all completed tasks, ignoring dates
    if (period === 'all-time') {
      const allCompleted = tasksSafe.filter(t => t.completed);
      logDiagnostics('useStrategicReviewState', `All-time filter: Found ${allCompleted.length} completed tasks`);
      return allCompleted;
    }
    
    // Filter completed tasks with valid completedAt dates within the range
    const filtered = tasksSafe.filter(task => {
      if (!task.completed) {
        return false;
      }
      
      // Detailed logging for diagnosis
      logDateInfo('FILTER_TASK', `Filtering task ${task.id} (${task.title})`, task.completedAt);
      
      // Handle tasks without completion date - exclude from filtered results
      if (!task.completedAt) {
        logDiagnostics('FILTER_TASK', `Task ${task.id} has no completedAt, excluding`);
        return false;
      }
      
      try {
        // Convert to Date object safely
        const completedDate = toSafeDate(task.completedAt);
        
        if (!completedDate) {
          logDiagnostics('FILTER_TASK', `Task ${task.id} completedAt could not be parsed: ${task.completedAt}`);
          return false;
        }
        
        // Check if within range
        const inRange = completedDate >= dateRange[0] && completedDate <= dateRange[1];
        
        logDiagnostics('FILTER_TASK', `Task ${task.id} date ${completedDate.toISOString()} in range: ${inRange}`, {
          taskDate: completedDate,
          rangeStart: dateRange[0],
          rangeEnd: dateRange[1]
        });
        
        return inRange;
      } catch (error) {
        logDiagnostics('FILTER_TASK', `Error filtering task ${task.id}: ${error}`);
        return false;
      }
    });
    
    logDiagnostics('useStrategicReviewState', `Filtered ${filtered.length} tasks from ${tasks.length} total tasks for period ${period}`);
    return filtered;
  }, [tasks, dateRange, period]);
  
  // Calculate task statistics
  const taskStats = useMemo<TaskStats>(() => {
    const totalCompletedTasks = tasks?.filter(t => t.completed)?.length || 0;
    const totalFilteredTasks = filteredTasks?.length || 0;
    
    logDiagnostics('useStrategicReviewState', 'Task statistics', {
      totalCompletedTasks,
      totalFilteredTasks,
      period
    });
    
    return {
      totalCompletedTasks,
      totalFilteredTasks
    };
  }, [tasks, filteredTasks, period]);
  
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
    logDiagnostics('useStrategicReviewState', `Changing period from ${period} to ${newPeriod}`);
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
