
import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export const useTaskFilters = (completedTasks: Task[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    return completedTasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Period filter
      let matchesPeriod = true;
      
      if (periodFilter !== 'all' && task.completedAt) {
        // Get the current date (use date-fns for proper timezone handling)
        const now = new Date();
        const completedDate = new Date(task.completedAt);
        
        // Format dates to remove time component for comparing only dates
        const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());
        
        if (periodFilter === 'today') {
          // Compare only the date components (year, month, day)
          matchesPeriod = completedDateOnly.getTime() === nowDateOnly.getTime();
        } else if (periodFilter === 'week') {
          // Calculate the start of the current week (Sunday)
          const weekStart = new Date(nowDateOnly);
          weekStart.setDate(nowDateOnly.getDate() - nowDateOnly.getDay());
          
          // Compare if the completed date is after the start of this week
          matchesPeriod = completedDateOnly >= weekStart;
        } else if (periodFilter === 'month') {
          // Compare if it's in the current month and year
          matchesPeriod = completedDate.getMonth() === now.getMonth() && 
                          completedDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'custom' && startDate && endDate) {
          // Apply the custom date range filter
          const start = startOfDay(startDate);
          const end = endOfDay(endDate);
          matchesPeriod = isWithinInterval(completedDate, { start, end });
        } else if (periodFilter === 'custom') {
          // If custom is selected but dates are not set yet, show all tasks
          matchesPeriod = true;
        }
      }
      
      // Score filter
      let matchesScore = true;
      if (scoreFilter === 'high') {
        matchesScore = task.totalScore >= 12;
      } else if (scoreFilter === 'medium') {
        matchesScore = task.totalScore >= 8 && task.totalScore < 12;
      } else if (scoreFilter === 'low') {
        matchesScore = task.totalScore < 8;
      }
      
      // Feedback filter
      const matchesFeedback = feedbackFilter === 'all' || task.feedback === feedbackFilter;
      
      // Pillar filter
      let matchesPillar = true;
      if (pillarFilter !== 'all') {
        const dominantScore = Math.max(task.consequenceScore, task.prideScore, task.constructionScore);
        if (pillarFilter === 'consequence') {
          matchesPillar = task.consequenceScore === dominantScore;
        } else if (pillarFilter === 'pride') {
          matchesPillar = task.prideScore === dominantScore;
        } else if (pillarFilter === 'construction') {
          matchesPillar = task.constructionScore === dominantScore;
        }
      }
      
      return matchesSearch && matchesPeriod && matchesScore && matchesFeedback && matchesPillar;
    });
  }, [completedTasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter, startDate, endDate]);

  // Apply sorting
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
      } else if (sortBy === 'highScore') {
        return b.totalScore - a.totalScore;
      } else if (sortBy === 'lowScore') {
        return a.totalScore - b.totalScore;
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
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
    sortBy, 
    setSortBy,
    showFilters,
    setShowFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredTasks,
    sortedTasks
  };
};
