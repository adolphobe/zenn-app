
import React, { useState, useEffect } from 'react';
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
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

/**
 * New Task History Page component with advanced analytics
 */
const TaskHistoryNewPage = () => {
  const queryClient = useQueryClient();
  const { 
    tasks: completedTasks, 
    isLoading: completedTasksLoading,
    refetch
  } = useCompletedTasksData();
  
  // Local state to manage optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  // Update local state when completed tasks change
  useEffect(() => {
    setLocalTasks(completedTasks);
  }, [completedTasks]);
  
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
    endDate, setEndDate,
    sortField, sortDirection, handleColumnSort,
    setFilteredTasksSource
  } = useTaskFilters(localTasks);
  
  // Update filtered tasks source when local tasks change
  useEffect(() => {
    setFilteredTasksSource(localTasks);
  }, [localTasks, setFilteredTasksSource]);
  
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
  
  // Calculate stats based on filtered tasks
  const calculateFilteredStats = () => {
    // Count of filtered tasks
    const count = filteredTasks.length;
    
    // High score tasks (score >= 12)
    const highScoreCount = filteredTasks.filter(task => task.totalScore >= 12).length;
    
    // Average score calculation with null/undefined check
    let averageScore = 0;
    const validScoreTasks = filteredTasks.filter(task => typeof task.totalScore === 'number');
    if (validScoreTasks.length > 0) {
      const totalScore = validScoreTasks.reduce((sum, task) => sum + (task.totalScore || 0), 0);
      averageScore = totalScore / validScoreTasks.length;
    }
    
    return {
      count,
      highScoreCount,
      averageScore
    };
  };
  
  // Get stats for current filtered tasks
  const filteredStats = calculateFilteredStats();
  
  // Function to clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setPeriodFilter('all');
    setScoreFilter('all');
    setFeedbackFilter('all');
    setPillarFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
    // Reset to default sort if needed
    setSortBy('newest');
    handleColumnSort('completedAt', 'desc');
  };
  
  // Check if filters are being applied
  const isFiltering = searchQuery.trim().length > 0 || 
    periodFilter !== 'all' || 
    scoreFilter !== 'all' || 
    feedbackFilter !== 'all' || 
    pillarFilter !== 'all';
    
  const resultsMessage = isFiltering 
    ? `${filteredTasks.length} ${filteredTasks.length === 1 ? 'resultado' : 'resultados'} encontrados`
    : '';
    
  // Task selection handler
  const handleSelectTask = (taskId: string) => {
    const selectedTask = localTasks.find(task => task.id === taskId);
    if (selectedTask) {
      setTaskToView(selectedTask);
    }
  };

  // Task restoration handlers - modificado para aceitar tanto um Task quanto um taskId
  const handleRestoreClick = (taskOrId: Task | string) => {
    // Se for um objeto Task, usamos ele diretamente
    if (typeof taskOrId === 'object') {
      setTaskToRestore(taskOrId);
      return;
    }
    
    // Se for um ID (string), buscamos a task correspondente
    const taskId = taskOrId;
    const taskToRestore = localTasks.find(task => task.id === taskId);
    if (taskToRestore) {
      setTaskToRestore(taskToRestore);
    }
  };

  const handleRestoreConfirm = async (taskId: string) => {
    try {
      // Optimistic UI update - remove the task from the local state
      setLocalTasks(prev => prev.filter(task => task.id !== taskId));
      setTaskToView(null);
      setTaskToRestore(null);
      
      // Show success toast
      toast({
        title: "Tarefa restaurada",
        description: "A tarefa foi restaurada com sucesso para sua lista de tarefas.",
      });
      
      // Call API to restore the task
      await restoreTask(taskId);
      
      // Refresh relevant queries to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] }); 
      
    } catch (error) {
      console.error('Error restoring task:', error);
      
      // Revert optimistic update on error
      await refetch();
      
      toast({
        title: "Erro ao restaurar tarefa",
        description: "Não foi possível restaurar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
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
  if (!localTasks || localTasks.length === 0) {
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
        tasks={localTasks} 
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
      
      {/* Display results count and clear filters link when filtering */}
      {isFiltering && (
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-muted-foreground">{resultsMessage}</p>
          <button 
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1"
          >
            Limpar filtro
          </button>
        </div>
      )}
      
      {/* Display dynamic task statistics based on filtered tasks */}
      <TaskStats 
        count={filteredStats.count}
        highScoreCount={filteredStats.highScoreCount}
        averageScore={filteredStats.averageScore}
        isFiltered={isFiltering}
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
              onSort={handleColumnSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          ) : (
            <TaskGrid
              tasks={paginatedTasks}
              onSelectTask={handleSelectTask}
              onRestoreTask={handleRestoreClick}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )
        ) : (
          <TaskGroupList
            groups={groupedTasks}
            viewMode={viewMode}
            onSelectTask={handleSelectTask}
            onRestoreTask={handleRestoreClick}
            onSort={handleColumnSort}
            sortField={sortField}
            sortDirection={sortDirection}
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
