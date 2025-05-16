
import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types';

export const useTaskFilters = (completedTasks: Task[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    return completedTasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Period filter
      let matchesPeriod = true;
      
      if (periodFilter !== 'all' && task.completedAt) {
        const now = new Date(2024, 4, 16); // May 16, 2024
        const completedDate = new Date(task.completedAt);
        
        if (periodFilter === 'today') {
          matchesPeriod = completedDate.toDateString() === now.toDateString();
        } else if (periodFilter === 'week') {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          matchesPeriod = completedDate >= weekStart;
        } else if (periodFilter === 'month') {
          matchesPeriod = completedDate.getMonth() === now.getMonth() && 
                          completedDate.getFullYear() === now.getFullYear();
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
  }, [completedTasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter]);

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
    filteredTasks,
    sortedTasks
  };
};
