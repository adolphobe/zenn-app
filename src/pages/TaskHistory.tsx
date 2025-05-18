import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';

// Import refactored hooks
import { useCompletedTasks } from '@/components/task-history/hooks/useCompletedTasks';
import { useTaskFilters } from '@/components/task-history/hooks/useTaskFilters';
import { useTaskPagination } from '@/components/task-history/hooks/useTaskPagination';

// Import refactored components
import { TaskHistoryStats } from '@/components/task-history/TaskHistoryStats';
import { TaskSearchBar, TaskFiltersToggle, AdvancedFilters } from '@/components/task-history/TaskFilters';
import { ViewToggle } from '@/components/task-history/ViewToggle';
import { TaskGroupGrid } from '@/components/task-history/task-cards';
import { TasksTable } from '@/components/task-history/TaskTable';
import { NoTasksMessage } from '@/components/task-history/NoTasksMessage';
import { TaskPagination } from '@/components/task-history/TaskPagination';

const TaskHistory = () => {
  const { state } = useAppContext();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  // Use our custom hooks to manage the task data, filtering and pagination
  const { completedTasks } = useCompletedTasks(state.tasks);
  
  const { 
    searchQuery, setSearchQuery,
    periodFilter, setPeriodFilter,
    scoreFilter, setScoreFilter,
    feedbackFilter, setFeedbackFilter, 
    pillarFilter, setPillarFilter,
    startDate, setStartDate,
    endDate, setEndDate,
    sortBy, setSortBy,
    showFilters, setShowFilters,
    filteredTasks,
    sortedTasks
  } = useTaskFilters(completedTasks);
  
  // Pass periodFilter to useTaskPagination
  const {
    currentPage,
    totalPages,
    paginatedTasks,
    groupedTasks,
    handlePageChange,
    getPageNumbers
  } = useTaskPagination(sortedTasks, periodFilter);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Pass filtered tasks to TaskHistoryStats instead of all completed tasks */}
        <TaskHistoryStats filteredTasks={sortedTasks} />
        
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
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
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
