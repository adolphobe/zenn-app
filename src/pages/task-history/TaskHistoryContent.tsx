
import React, { useState, useMemo } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logError } from '@/utils/logUtils';
import { Task } from '@/types';

// Import refactored hooks
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

interface TaskHistoryContentProps {
  setError: (error: string | null) => void;
}

export const TaskHistoryContent: React.FC<TaskHistoryContentProps> = ({ setError }) => {
  const { completedTasks } = useTaskDataContext();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  // Initialize state variables for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Create validated tasks array using memo to prevent repeated calculations
  const validatedTasks = useMemo(() => {
    if (!completedTasks.length) return [];
    
    // Defensive copy of tasks with validated dates - only calculate once
    return completedTasks.map(task => ({
      ...task,
      // Ensure completedAt is a valid Date
      completedAt: task.completedAt instanceof Date && !isNaN(task.completedAt.getTime())
        ? task.completedAt
        : new Date() // Use current date as fallback
    }));
  }, [completedTasks]);
  
  // Process filters and pagination
  let filteredTasks: Task[] = [];
  let sortedTasks: Task[] = [];
  let groupedTasks = [];
  let paginatedTasks: Task[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let pageNumbers: (number | string)[] = [];
  let handlePageChange = (page: number) => {};
  
  try {
    // Use the filter hook with our state values
    if (validatedTasks.length > 0) {
      const filters = useTaskFilters(
        validatedTasks,
        {
          searchQuery,
          periodFilter,
          scoreFilter,
          feedbackFilter,
          pillarFilter,
          startDate,
          endDate,
          sortBy,
          showFilters
        }
      );
      
      // Use useMemo values from the filter hook
      filteredTasks = filters.filteredTasks;
      sortedTasks = filters.sortedTasks;
      
      // Use the pagination hook with filtered results
      const pagination = useTaskPagination(sortedTasks, periodFilter);
      currentPage = pagination.currentPage;
      totalPages = pagination.totalPages;
      paginatedTasks = pagination.paginatedTasks;
      groupedTasks = pagination.groupedTasks;
      handlePageChange = pagination.handlePageChange;
      pageNumbers = pagination.getPageNumbers();
    }
  } catch (err) {
    logError('TaskHistory', 'Erro ao processar tarefas:', err);
    setError(`Erro ao processar o histórico de tarefas: ${err instanceof Error ? err.message : String(err)}`);
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Histórico de Tarefas</h1>
        
        {/* Display task count even if there's an error */}
        <div className="text-muted-foreground">
          {completedTasks.length > 0 ? 
            `${completedTasks.length} ${completedTasks.length === 1 ? 'tarefa concluída' : 'tarefas concluídas'}` : 
            'Nenhuma tarefa concluída para exibir'
          }
        </div>
        
        {/* Pass filtered tasks to TaskHistoryStats */}
        {sortedTasks.length > 0 && (
          <TaskHistoryStats filteredTasks={sortedTasks} />
        )}
        
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
        {(sortedTasks.length === 0 || completedTasks.length === 0) && <NoTasksMessage />}
        
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
            pageNumbers={pageNumbers}
          />
        )}
      </div>
    </div>
  );
};
