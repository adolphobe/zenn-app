
import { useState, useMemo, useCallback } from 'react';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';

type ViewMode = 'list' | 'grid';
type SortBy = 'newest' | 'oldest' | 'highestScore' | 'lowestScore';
type SortField = 'completedAt' | 'title' | 'totalScore' | 'feedback';
type SortDirection = 'asc' | 'desc';
type PeriodFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';
type ScoreFilter = 'all' | 'high' | 'medium' | 'low';
type FeedbackFilter = 'all' | 'transformed' | 'relief' | 'obligation';
type PillarFilter = 'all' | 'physical' | 'emotional' | 'mental' | 'spiritual';

export const useTaskFilters = (initialTasks: Task[]) => {
  // Basic filters
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>('all');
  const [pillarFilter, setPillarFilter] = useState<PillarFilter>('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  // Sort column for table
  const [sortField, setSortField] = useState<SortField>('completedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Tasks source
  const [tasksSource, setTasksSource] = useState<Task[]>(initialTasks);

  // Update tasks source when initialTasks changes
  const setFilteredTasksSource = useCallback((tasks: Task[]) => {
    setTasksSource(tasks);
  }, []);

  // Apply all filters to tasks
  const filteredTasks = useMemo(() => {
    // Start with all tasks
    let filtered = tasksSource;
    
    // Apply search filter if provided
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(normalizedQuery) || 
        (task.description && task.description.toLowerCase().includes(normalizedQuery))
      );
    }
    
    // Apply period filter
    if (periodFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const lastYear = new Date(today);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      
      filtered = filtered.filter(task => {
        if (!task.completedAt) return false;
        
        const completedDate = task.completedAt instanceof Date ? 
          task.completedAt : 
          dateService.parseDate(task.completedAt);
        
        if (!completedDate) return false;
        
        const taskDateOnly = new Date(
          completedDate.getFullYear(), 
          completedDate.getMonth(), 
          completedDate.getDate()
        );
        
        switch (periodFilter) {
          case 'today':
            return taskDateOnly.getTime() === today.getTime();
          case 'yesterday':
            return taskDateOnly.getTime() === yesterday.getTime();
          case 'week':
            return completedDate >= lastWeek;
          case 'month':
            return completedDate >= lastMonth;
          case 'year':
            return completedDate >= lastYear;
          case 'custom':
            const isAfterStart = !startDate || completedDate >= startDate;
            const isBeforeEnd = !endDate || completedDate <= endDate;
            return isAfterStart && isBeforeEnd;
          default:
            return true;
        }
      });
    }
    
    // Apply score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(task => {
        const score = task.totalScore || 0;
        
        switch (scoreFilter) {
          case 'high':
            return score >= 12;
          case 'medium':
            return score >= 6 && score < 12;
          case 'low':
            return score < 6;
          default:
            return true;
        }
      });
    }
    
    // Apply feedback filter
    if (feedbackFilter !== 'all') {
      filtered = filtered.filter(task => task.feedback === feedbackFilter);
    }
    
    // Apply pillar filter
    if (pillarFilter !== 'all') {
      filtered = filtered.filter(task => {
        switch (pillarFilter) {
          case 'physical':
            return task.physicalScore > 0;
          case 'emotional':
            return task.emotionalScore > 0;
          case 'mental':
            return task.mentalScore > 0;
          case 'spiritual':
            return task.spiritualScore > 0;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    const sortedTasks = [...filtered].sort((a, b) => {
      switch (sortField) {
        case 'completedAt': {
          const dateA = a.completedAt instanceof Date ? a.completedAt : new Date(a.completedAt || '');
          const dateB = b.completedAt instanceof Date ? b.completedAt : new Date(b.completedAt || '');
          return sortDirection === 'asc' 
            ? dateA.getTime() - dateB.getTime() 
            : dateB.getTime() - dateA.getTime();
        }
        case 'title': {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return sortDirection === 'asc'
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        }
        case 'totalScore': {
          const scoreA = a.totalScore || 0;
          const scoreB = b.totalScore || 0;
          return sortDirection === 'asc' 
            ? scoreA - scoreB 
            : scoreB - scoreA;
        }
        case 'feedback': {
          const feedbackA = a.feedback || '';
          const feedbackB = b.feedback || '';
          return sortDirection === 'asc'
            ? feedbackA.localeCompare(feedbackB)
            : feedbackB.localeCompare(feedbackA);
        }
        default:
          return 0;
      }
    });
    
    return sortedTasks;
  }, [tasksSource, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter, startDate, endDate, sortField, sortDirection]);
  
  // Column sort handler
  const handleColumnSort = (field: SortField, direction?: SortDirection) => {
    if (field === sortField && !direction) {
      // Toggle direction if clicking the same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and direction (or default to asc)
      setSortField(field);
      setSortDirection(direction || 'asc');
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filteredTasks,
    showFilters,
    setShowFilters,
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
    sortField,
    sortDirection,
    handleColumnSort,
    setFilteredTasksSource
  };
};
