
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';
import { logError } from '@/utils/logUtils';

// Type definition for filter options
interface FilterOptions {
  searchQuery: string;
  periodFilter: string;
  scoreFilter: string;
  feedbackFilter: string;
  pillarFilter: string;
  startDate?: Date;
  endDate?: Date;
  sortBy: string;
  showFilters: boolean;
}

export const useTaskFilters = (
  tasks: Task[],
  initialFilters: FilterOptions = {
    searchQuery: '',
    periodFilter: 'all',
    scoreFilter: 'all',
    feedbackFilter: 'all',
    pillarFilter: 'all',
    startDate: undefined,
    endDate: undefined,
    sortBy: 'newest',
    showFilters: false
  }
) => {
  // Use the initial filter values from props
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [periodFilter, setPeriodFilter] = useState(initialFilters.periodFilter);
  const [scoreFilter, setScoreFilter] = useState(initialFilters.scoreFilter);
  const [feedbackFilter, setFeedbackFilter] = useState(initialFilters.feedbackFilter);
  const [pillarFilter, setPillarFilter] = useState(initialFilters.pillarFilter);
  const [startDate, setStartDate] = useState<Date | undefined>(initialFilters.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialFilters.endDate);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [showFilters, setShowFilters] = useState(initialFilters.showFilters);
  const [filterErrors, setFilterErrors] = useState<string[]>([]);

  // For date debugging - MOVED to useEffect to prevent render loops
  useEffect(() => {
    if (startDate || endDate) {
      logDateInfo('useTaskFilters', 'Date filters changed', { startDate, endDate });
    }
  }, [startDate, endDate]);

  // Filter tasks based on search query and filters - PROPERLY MEMOIZED
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const errors: string[] = [];

    try {
      const filtered = tasks.filter((task) => {
        // Validate task has required fields
        if (!task.title) {
          errors.push(`Task ${task.id} missing title`);
          return false;
        }

        // Apply search filter - FIXED: Only search in title, not notes
        const matchesSearch = !searchQuery || 
          task.title.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Apply period filter with improved error handling
        let matchesPeriod = true;
        if (periodFilter !== 'all') {
          // Ensure we have a valid date to work with
          if (!task.completedAt) {
            // This should not happen for completed tasks
            errors.push(`Task ${task.id} is missing completedAt date`);
            return false;
          }

          // Make sure completedAt is a valid date
          const completedAt = task.completedAt instanceof Date 
            ? task.completedAt 
            : dateService.parseDate(task.completedAt);
          
          if (!completedAt) {
            errors.push(`Task ${task.id} has invalid completedAt date: ${task.completedAt}`);
            return false;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
          
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          
          switch (periodFilter) {
            case 'today':
              matchesPeriod = completedAt >= today;
              break;
            case 'week':
              matchesPeriod = completedAt >= weekStart;
              break;
            case 'month':
              matchesPeriod = completedAt >= monthStart;
              break;
            case 'custom':
              if (startDate && completedAt < startDate) matchesPeriod = false;
              if (endDate) {
                const nextDay = new Date(endDate);
                nextDay.setDate(endDate.getDate() + 1);
                if (completedAt >= nextDay) matchesPeriod = false;
              }
              break;
          }
        }

        if (!matchesPeriod) return false;

        // Apply score filter - FIXED to handle undefined scores
        let matchesScore = true;
        if (scoreFilter !== 'all') {
          // Make sure we have a total score
          const totalScore = task.totalScore || 0;
          
          switch (scoreFilter) {
            case 'high':
              matchesScore = totalScore >= 12;
              break;
            case 'medium':
              matchesScore = totalScore >= 8 && totalScore < 12;
              break;
            case 'low':
              matchesScore = totalScore < 8;
              break;
          }
        }

        if (!matchesScore) return false;

        // Apply feedback filter
        const matchesFeedback = feedbackFilter === 'all' || task.feedback === feedbackFilter;
        if (!matchesFeedback) return false;

        // Apply pillar filter with error handling
        let matchesPillar = true;
        if (pillarFilter !== 'all') {
          // Make sure we have the required scores
          const scores = {
            'consequence': task.consequenceScore || 0,
            'pride': task.prideScore || 0,
            'construction': task.constructionScore || 0,
          };

          // Check if the filtered pillar is the dominant one
          const highestScore = Math.max(...Object.values(scores));
          matchesPillar = scores[pillarFilter as keyof typeof scores] === highestScore;
        }

        return matchesPillar;
      });

      return filtered;
    } catch (err) {
      const errorMsg = `Error filtering tasks: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(errorMsg);
      logError('useTaskFilters', errorMsg, err);
      // Return empty array on error
      return [];
    } finally {
      // Only update errors via useEffect to prevent render loop
      if (errors.length > 0) {
        setTimeout(() => {
          setFilterErrors(errors);
        }, 0);
      }
    }
  }, [tasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter, startDate, endDate]);

  // Clean up errors when dependencies change
  useEffect(() => {
    setFilterErrors([]);
  }, [tasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter, startDate, endDate]);

  // Sort filtered tasks with improved error handling and proper memoization
  const sortedTasks = useMemo(() => {
    if (!filteredTasks.length) return [];
    
    try {
      return [...filteredTasks].sort((a, b) => {
        const aDate = a.completedAt instanceof Date ? a.completedAt : new Date();
        const bDate = b.completedAt instanceof Date ? b.completedAt : new Date();
        
        switch (sortBy) {
          case 'newest':
            return (+bDate) - (+aDate);
          case 'oldest':
            return (+aDate) - (+bDate);
          case 'highScore':
            return (b.totalScore || 0) - (a.totalScore || 0);
          case 'lowScore':
            return (a.totalScore || 0) - (b.totalScore || 0);
          case 'alphabetical':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    } catch (err) {
      logError('useTaskFilters', 'Error sorting tasks:', err);
      return [...filteredTasks]; // Return unsorted array on error
    }
  }, [filteredTasks, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    periodFilter,
    setPeriodFilter,
    scoreFilter,
    setScoreFilter,
    feedbackFilter,
    setFeedbackFilter,
    pillarFilter,
    setPillarFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    filteredTasks,
    sortedTasks,
    filterErrors
  };
};
