
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import TaskAnalyticsSection from './components/TaskAnalyticsSection';
import { motion } from 'framer-motion';

/**
 * New Task History Page component with advanced analytics
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

  // State for modals and analytics
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  const [taskToRestore, setTaskToRestore] = useState<Task | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  
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
  
  // Toggle analytics section
  const toggleAnalytics = () => {
    setShowAnalytics(prev => !prev);
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
    <motion.div 
      className="container p-4 mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Histórico de Tarefas</h1>
        
        <Button 
          variant={showAnalytics ? "default" : "outline"} 
          onClick={toggleAnalytics}
          className="gap-2"
        >
          <BarChart2 size={18} />
          {showAnalytics ? "Ocultar Análises" : "Mostrar Análises"}
        </Button>
      </div>
      
      {/* Analytics section */}
      <TaskAnalyticsSection 
        tasks={completedTasks} 
        isVisible={showAnalytics} 
      />
      
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
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
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
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
      </motion.div>
      
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
    </motion.div>
  );
};

export default TaskHistoryNewPage;
