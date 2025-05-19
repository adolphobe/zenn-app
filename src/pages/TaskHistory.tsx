
import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { logDateInfo } from '@/utils/diagnosticLog';

const TaskHistory = () => {
  const { state } = useAppContext();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  // Use our custom hooks to manage the task data, filtering and pagination
  const { completedTasks, isLoading, error } = useCompletedTasks(state.tasks);
  
  React.useEffect(() => {
    if (completedTasks.length > 0) {
      // Log the first few tasks to help diagnose date issues
      completedTasks.slice(0, 3).forEach(task => {
        logDateInfo('TaskHistory', `Task ${task.id} completedAt in list`, task.completedAt);
      });
    }
  }, [completedTasks]);
  
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

  if (isLoading || authLoading) {
    return (
      <div className="container p-4 mx-auto flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando histórico de tarefas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container p-4 mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar tarefas</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container p-4 mx-auto">
        <Alert>
          <AlertTitle>Você não está autenticado</AlertTitle>
          <AlertDescription>
            Faça login para ver o histórico de tarefas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
