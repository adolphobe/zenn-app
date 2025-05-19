
import { useState, useMemo } from 'react';
import { Task } from '@/types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

/**
 * Hook to manage task filtering and sorting functionality
 */
export const useTaskFilters = (tasks: Task[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filters
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Filter tasks based on search query and advanced filters
  const filteredTasks = useMemo(() => {
    if (!tasks || !tasks.length) return [];
    
    return tasks.filter(task => {
      // Text search filter
      const matchesText = !searchQuery.trim() || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!matchesText) return false;
      
      // Period filter
      const taskDate = task.completedAt ? new Date(task.completedAt) : null;
      let matchesPeriod = true;
      
      if (taskDate && periodFilter !== 'all') {
        const now = new Date();
        
        if (periodFilter === 'today') {
          const todayStart = startOfDay(now);
          const todayEnd = endOfDay(now);
          matchesPeriod = isWithinInterval(taskDate, { start: todayStart, end: todayEnd });
        } 
        else if (periodFilter === 'week') {
          const weekStart = startOfWeek(now, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
          matchesPeriod = isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
        } 
        else if (periodFilter === 'month') {
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          matchesPeriod = isWithinInterval(taskDate, { start: monthStart, end: monthEnd });
        } 
        else if (periodFilter === 'custom') {
          if (startDate && endDate) {
            const customStart = startOfDay(startDate);
            const customEnd = endOfDay(endDate);
            matchesPeriod = isWithinInterval(taskDate, { start: customStart, end: customEnd });
          }
        }
      }
      if (!matchesPeriod) return false;
      
      // Score filter
      const score = task.totalScore || 0;
      let matchesScore = true;
      
      if (scoreFilter !== 'all') {
        if (scoreFilter === 'high') {
          matchesScore = score >= 12;
        } else if (scoreFilter === 'medium') {
          matchesScore = score >= 8 && score < 12;
        } else if (scoreFilter === 'low') {
          matchesScore = score < 8;
        }
      }
      if (!matchesScore) return false;
      
      // Feedback filter
      const feedback = task.feedback;
      let matchesFeedback = true;
      
      if (feedbackFilter !== 'all') {
        matchesFeedback = feedback === feedbackFilter;
      }
      if (!matchesFeedback) return false;
      
      // Pillar filter
      let matchesPillar = true;
      
      if (pillarFilter !== 'all') {
        const maxValue = Math.max(
          task.consequenceScore || 0,
          task.prideScore || 0,
          task.constructionScore || 0
        );
        
        if (pillarFilter === 'consequence' && task.consequenceScore !== maxValue) {
          matchesPillar = false;
        } else if (pillarFilter === 'pride' && task.prideScore !== maxValue) {
          matchesPillar = false;
        } else if (pillarFilter === 'construction' && task.constructionScore !== maxValue) {
          matchesPillar = false;
        }
      }
      
      return matchesPillar;
    });
  }, [
    tasks, 
    searchQuery, 
    periodFilter, 
    scoreFilter, 
    feedbackFilter, 
    pillarFilter, 
    startDate, 
    endDate
  ]);
  
  // Sort filtered tasks
  const sortedTasks = useMemo(() => {
    if (!filteredTasks.length) return [];
    
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
        case 'highScore':
          return (b.totalScore || 0) - (a.totalScore || 0);
        case 'lowScore':
          return (a.totalScore || 0) - (b.totalScore || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
      }
    });
  }, [filteredTasks, sortBy]);
  
  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filteredTasks: sortedTasks,
    showFilters,
    setShowFilters,
    
    // Advanced filters
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
    setEndDate
  };
};
