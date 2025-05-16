
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

// Import refactored hooks
import { useCompletedTasks } from '@/components/task-history/hooks/useCompletedTasks';
import { useTaskFilters } from '@/components/task-history/hooks/useTaskFilters';
import { useTaskPagination } from '@/components/task-history/hooks/useTaskPagination';

// Import refactored components
import { TaskHistoryStats } from '@/components/task-history/TaskHistoryStats';
import { TaskSearchBar, TaskFiltersToggle, AdvancedFilters } from '@/components/task-history/TaskFilters';
import { ViewToggle } from '@/components/task-history/ViewToggle';
import { TaskGroupGrid } from '@/components/task-history/TaskCards';
import { TasksTable } from '@/components/task-history/TaskTable';
import { NoTasksMessage } from '@/components/task-history/NoTasksMessage';
import { TaskPagination } from '@/components/task-history/TaskPagination';

const TaskHistory = () => {
  const { state } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  // Use our custom hooks to manage the task data, filtering and pagination
  const { completedTasks } = useCompletedTasks(state.tasks);
  
  const { 
    searchQuery, setSearchQuery,
    periodFilter, setPeriodFilter,
    scoreFilter, setScoreFilter,
    feedbackFilter, setFeedbackFilter, 
    pillarFilter, setPillarFilter,
    sortBy, setSortBy,
    showFilters, setShowFilters,
    sortedTasks
  } = useTaskFilters(completedTasks);
  
  const {
    currentPage,
    totalPages,
    paginatedTasks,
    groupedTasks,
    handlePageChange,
    getPageNumbers
  } = useTaskPagination(sortedTasks);

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
        {viewMode === 'list' && paginatedTasks.length > 0 && <TasksTable tasks={paginatedTasks} />}
        
        {/* Grid view with timeline grouping */}
        {viewMode === 'grid' && paginatedTasks.length > 0 && <TaskGroupGrid groups={groupedTasks} />}
        
        {/* Pagination */}
        {sortedTasks.length > 0 && (
          <TaskPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            pageNumbers={getPageNumbers()}
          />
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
