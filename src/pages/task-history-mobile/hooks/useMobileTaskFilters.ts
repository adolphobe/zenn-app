
import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types';
import { isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

export const useMobileTaskFilters = (tasks: Task[] = []) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Apply filters
  const filteredTasks = useMemo(() => {
    if (!tasks || !tasks.length) return [];
    
    let filtered = [...tasks];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query)
      );
    }
    
    // Period filter
    if (periodFilter !== 'all') {
      filtered = filtered.filter(task => {
        if (!task.completedAt) return false;
        
        const completedDate = new Date(task.completedAt);
        
        switch (periodFilter) {
          case 'today':
            return isToday(completedDate);
          case 'yesterday':
            return isYesterday(completedDate);
          case 'week':
            return isThisWeek(completedDate);
          case 'month':
            return isThisMonth(completedDate);
          default:
            return true;
        }
      });
    }
    
    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(task => {
        switch (scoreFilter) {
          case 'high':
            return task.totalScore >= 12;
          case 'medium':
            return task.totalScore >= 8 && task.totalScore < 12;
          case 'low':
            return task.totalScore < 8;
          default:
            return true;
        }
      });
    }
    
    // Feedback filter
    if (feedbackFilter !== 'all') {
      filtered = filtered.filter(task => task.feedback === feedbackFilter);
    }
    
    // Sort
    return sortTasks(filtered, sortBy);
  }, [tasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, sortBy]);
  
  // Sort tasks
  const sortTasks = (tasks: Task[], sortType: string) => {
    return [...tasks].sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
        case 'oldest':
          return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
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
  };
  
  // Check if any filter is active
  const isFiltering = useMemo(() => {
    return searchQuery.trim().length > 0 || 
      periodFilter !== 'all' || 
      scoreFilter !== 'all' || 
      feedbackFilter !== 'all';
  }, [searchQuery, periodFilter, scoreFilter, feedbackFilter]);
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setPeriodFilter('all');
    setScoreFilter('all');
    setFeedbackFilter('all');
  };
  
  return {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    periodFilter,
    setPeriodFilter,
    scoreFilter, 
    setScoreFilter,
    feedbackFilter,
    setFeedbackFilter,
    sortBy,
    setSortBy,
    clearAllFilters,
    isFiltering
  };
};
