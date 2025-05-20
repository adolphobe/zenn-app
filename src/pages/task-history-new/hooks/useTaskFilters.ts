
import { useState, useMemo, useCallback } from 'react';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';

export type ViewMode = 'list' | 'grid';
export type SortBy = 'newest' | 'oldest' | 'highestScore' | 'lowestScore' | 'alphabetical';
export type SortField = 'completedAt' | 'title' | 'totalScore' | 'feedback';
export type SortDirection = 'asc' | 'desc';
export type PeriodFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';
export type ScoreFilter = 'all' | 'high' | 'medium' | 'low';
export type FeedbackFilter = 'all' | 'transformed' | 'relief' | 'obligation';
export type PillarFilter = 'all' | 'consequence' | 'pride' | 'construction';

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
        task.title.toLowerCase().includes(normalizedQuery)
        // Note: Task type doesn't have description property, so we need to remove this check
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
        // Use the updated property names from the Task type
        // Instead of physicalScore, emotionalScore, etc. we'll use the ones from the actual Task type
        switch (pillarFilter) {
          case 'consequence':
            return task.consequenceScore > 0;
          case 'pride':
            return task.prideScore > 0;
          case 'construction':
            return task.constructionScore > 0;
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
  
  // Type-safe setters for string-based props passed to components
  const setSortByTypeSafe = (sort: string) => {
    setSortBy(sort as SortBy);
  };
  
  const setPeriodFilterTypeSafe = (period: string) => {
    setPeriodFilter(period as PeriodFilter);
  };
  
  const setScoreFilterTypeSafe = (score: string) => {
    setScoreFilter(score as ScoreFilter);
  };
  
  const setFeedbackFilterTypeSafe = (feedback: string) => {
    setFeedbackFilter(feedback as FeedbackFilter);
  };
  
  const setPillarFilterTypeSafe = (pillar: string) => {
    setPillarFilter(pillar as PillarFilter);
  };

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy: setSortByTypeSafe,
    filteredTasks,
    showFilters,
    setShowFilters,
    periodFilter,
    setPeriodFilter: setPeriodFilterTypeSafe,
    scoreFilter,
    setScoreFilter: setScoreFilterTypeSafe,
    feedbackFilter,
    setFeedbackFilter: setFeedbackFilterTypeSafe,
    pillarFilter,
    setPillarFilter: setPillarFilterTypeSafe,
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
