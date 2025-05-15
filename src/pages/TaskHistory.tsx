
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';

// Import refactored components
import { TaskHistoryStats } from '@/components/task-history/TaskHistoryStats';
import { TaskSearchBar, TaskFiltersToggle, AdvancedFilters } from '@/components/task-history/TaskFilters';
import { ViewToggle } from '@/components/task-history/ViewToggle';
import { TaskGroupGrid } from '@/components/task-history/TaskCards';
import { TasksTable } from '@/components/task-history/TaskTable';
import { NoTasksMessage } from '@/components/task-history/NoTasksMessage';
import { groupTasksByTimeline } from '@/components/task-history/utils';

const TaskHistory = () => {
  const { state } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Filter for completed tasks only
  const completedTasks = useMemo(() => {
    return state.tasks.filter(task => task.completed && task.completedAt);
  }, [state.tasks]);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    return completedTasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Period filter
      let matchesPeriod = true;
      const now = new Date();
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
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
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

  // Group by timeline for grid view
  const groupedTasks = useMemo(() => {
    return groupTasksByTimeline(sortedTasks);
  }, [sortedTasks]);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Header with stats */}
        <TaskHistoryStats completedTasks={completedTasks} />
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <TaskSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          
          <div className="flex gap-2">
            <TaskFiltersToggle 
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
            
            <ViewToggle 
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <AdvancedFilters
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            scoreFilter={scoreFilter}
            setScoreFilter={setScoreFilter}
            feedbackFilter={feedbackFilter}
            setFeedbackFilter={setFeedbackFilter}
            pillarFilter={pillarFilter}
            setPillarFilter={setPillarFilter}
          />
        )}

        {/* No results message */}
        {sortedTasks.length === 0 && <NoTasksMessage />}
        
        {/* Task list view */}
        {viewMode === 'list' && sortedTasks.length > 0 && <TasksTable tasks={sortedTasks} />}
        
        {/* Grid view with timeline grouping */}
        {viewMode === 'grid' && sortedTasks.length > 0 && <TaskGroupGrid groups={groupedTasks} />}
      </div>
    </div>
  );
};

export default TaskHistory;
