
import { useState, useMemo, useCallback } from 'react';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';

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

  // For date debugging
  useMemo(() => {
    if (startDate || endDate) {
      logDateInfo('useTaskFilters', 'Date filters changed', { startDate, endDate });
    }
  }, [startDate, endDate]);

  // Filter tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    return tasks.filter((task) => {
      // Apply search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Apply period filter
      let matchesPeriod = true;
      if (periodFilter !== 'all') {
        // Ensure we have a valid date to work with
        if (!task.completedAt) return false;

        const completedAt = task.completedAt instanceof Date 
          ? task.completedAt 
          : dateService.parseDate(task.completedAt);
        
        if (!completedAt) {
          console.warn('useTaskFilters: Invalid completedAt date detected', task.completedAt);
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

      // Apply score filter
      let matchesScore = true;
      if (scoreFilter !== 'all') {
        switch (scoreFilter) {
          case 'high':
            matchesScore = task.totalScore >= 12;
            break;
          case 'medium':
            matchesScore = task.totalScore >= 8 && task.totalScore < 12;
            break;
          case 'low':
            matchesScore = task.totalScore < 8;
            break;
        }
      }

      if (!matchesScore) return false;

      // Apply feedback filter
      const matchesFeedback = feedbackFilter === 'all' || task.feedback === feedbackFilter;
      if (!matchesFeedback) return false;

      // Apply pillar filter
      let matchesPillar = true;
      if (pillarFilter !== 'all') {
        const scores = {
          'consequence': task.consequenceScore,
          'pride': task.prideScore,
          'construction': task.constructionScore,
        };

        // Check if the filtered pillar is the dominant one
        const highestScore = Math.max(...Object.values(scores));
        matchesPillar = scores[pillarFilter as keyof typeof scores] === highestScore;
      }

      return matchesPillar;
    });
  }, [tasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter, startDate, endDate]);

  // Sort filtered tasks
  const sortedTasks = useMemo(() => {
    if (!filteredTasks.length) return [];

    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.completedAt instanceof Date ? +b.completedAt : 0) - 
                 (a.completedAt instanceof Date ? +a.completedAt : 0);
        case 'oldest':
          return (a.completedAt instanceof Date ? +a.completedAt : 0) - 
                 (b.completedAt instanceof Date ? +b.completedAt : 0);
        case 'highScore':
          return b.totalScore - a.totalScore;
        case 'lowScore':
          return a.totalScore - b.totalScore;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
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
    sortedTasks
  };
};
