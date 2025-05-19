
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useCompletedTasksData } from './hooks/useCompletedTasksData';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useTaskPagination } from './hooks/useTaskPagination';
import { TaskStats } from './components/TaskStats';
import { TaskTable } from './components/TaskTable';
import { TaskGrid } from './components/TaskGrid';
import { TaskGroupList } from './components/TaskGroupList';
import { TaskSearch } from './components/TaskSearch';
import { ViewToggle } from './components/ViewToggle';
import { AdvancedFilters } from './components/AdvancedFilters';
import { TaskPagination } from './components/TaskPagination';
import TaskViewModal from './components/TaskViewModal';
import RestoreTaskDialog from './components/RestoreTaskDialog';
import { restoreTask } from './services/taskActions';
import { Task } from '@/types';

/**
 * New Task History Page component that will gradually incorporate features from the existing one
 */
const TaskHistoryNewPage = () => {
  const { 
    tasks: completedTasks, 
    isLoading: completedTasksLoading,
    stats,
    refetch
  } = useCompletedTasksData();
  
  // Use the task filters hook with all filtering capabilities
  const { 
    searchQuery, setSearchQuery,
    viewMode, setViewMode,
    sortBy, setSortBy,
    filteredTasks,
    showFilters, setShowFilters,
    periodFilter, setPeriodFilter,
    scoreFilter, setScoreFilter,
    feedbackFilter, setFeedbackFilter,
    pillarFilter, setPillarFilter,
    startDate, setStartDate,
    endDate, setEndDate
  } = useTaskFilters(completedTasks);
  
  // Use pagination with task grouping
  const {
    currentPage,
    totalPages,
    paginatedTasks,
    groupedTasks,
    handlePageChange
  } = useTaskPagination(filteredTasks);

  // State for modals
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  const [taskToRestore, setTaskToRestore] = useState<Task | null>(null);
  
  // Task selection handler
  const handleSelectTask = (taskId: string) => {
    const selectedTask = completedTasks.find(task => task.id === taskId);
    if (selectedTask) {
      setTaskToView(selectedTask);
    }
  };

  // Task restoration handlers
  const handleRestoreClick = (taskId: string) => {
    const taskToRestore = completedTasks.find(task => task.id === taskId);
    if (taskToRestore) {
      setTaskToRestore(taskToRestore);
    }
  };

  const handleRestoreConfirm = async (taskId: string) => {
    await restoreTask(taskId);
    refetch(); // Refresh task list after restoration
  };
  
  // Loading state
  if (completedTasksLoading) {
    return (
      <div className="container p-4 mx-auto flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando histórico de tarefas...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!completedTasks || completedTasks.length === 0) {
    return (
      <div className="container p-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Histórico de Tarefas</h1>
        <Alert>
          <AlertTitle>Nenhuma tarefa concluída</AlertTitle>
          <AlertDescription>
            Quando você concluir tarefas, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show search results message when filtering
  const isFiltering = searchQuery.trim().length > 0 || 
    periodFilter !== 'all' || 
    scoreFilter !== 'all' || 
    feedbackFilter !== 'all' || 
    pillarFilter !== 'all';
    
  const resultsMessage = isFiltering 
    ? `${filteredTasks.length} ${filteredTasks.length === 1 ? 'resultado' : 'resultados'} encontrados`
    : '';

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Histórico de Tarefas</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        {/* Search bar */}
        <TaskSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        
        {/* View toggle */}
        <ViewToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
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
      
      {/* Display results count when filtering */}
      {isFiltering && (
        <p className="text-sm text-muted-foreground mb-4">{resultsMessage}</p>
      )}
      
      {/* Display task statistics */}
      <TaskStats 
        count={stats.count}
        highScoreCount={stats.highScoreCount}
        averageScore={stats.averageScore}
      />
      
      {/* Display tasks */}
      <div className="mt-6">
        {/* If grouping is enabled, show grouped tasks */}
        {periodFilter !== 'all' || searchQuery ? (
          viewMode === 'list' ? (
            <TaskTable 
              tasks={paginatedTasks} 
              onSelectTask={handleSelectTask}
              onRestoreTask={handleRestoreClick}
            />
          ) : (
            <TaskGrid
              tasks={paginatedTasks}
              onSelectTask={handleSelectTask}
              onRestoreTask={handleRestoreClick}
            />
          )
        ) : (
          <TaskGroupList
            groups={groupedTasks}
            viewMode={viewMode}
            onSelectTask={handleSelectTask}
            onRestoreTask={handleRestoreClick}
          />
        )}
        
        {/* Pagination controls */}
        {totalPages > 1 && (
          <TaskPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      
      {/* Task modals */}
      <TaskViewModal
        task={taskToView}
        isOpen={!!taskToView}
        onClose={() => setTaskToView(null)}
        onRestore={handleRestoreClick}
      />

      <RestoreTaskDialog
        task={taskToRestore}
        isOpen={!!taskToRestore}
        onClose={() => setTaskToRestore(null)}
        onConfirm={handleRestoreConfirm}
      />
    </div>
  );
};

export default TaskHistoryNewPage;
