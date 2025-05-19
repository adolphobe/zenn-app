
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useCompletedTasksData } from './hooks/useCompletedTasksData';
import { useTaskFilters } from './hooks/useTaskFilters';
import { TaskStats } from './components/TaskStats';
import { TaskTable } from './components/TaskTable';
import { TaskGrid } from './components/TaskGrid';
import { TaskSearch } from './components/TaskSearch';
import { ViewToggle } from './components/ViewToggle';
import { AdvancedFilters } from './components/AdvancedFilters';

/**
 * New Task History Page component that will gradually incorporate features from the existing one
 */
const TaskHistoryNewPage = () => {
  const { 
    tasks: completedTasks, 
    isLoading: completedTasksLoading,
    stats,
    selectedTaskId,
    setSelectedTaskId
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
        <h1 className="text-2xl font-bold mb-4">Histórico de Tarefas (Novo)</h1>
        <Alert>
          <AlertTitle>Nenhuma tarefa concluída</AlertTitle>
          <AlertDescription>
            Quando você concluir tarefas, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle task selection
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

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
      <h1 className="text-2xl font-bold mb-6">Histórico de Tarefas (Novo)</h1>
      
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
      
      {/* Display tasks in appropriate view mode */}
      {viewMode === 'list' ? (
        <TaskTable 
          tasks={filteredTasks} 
          onSelectTask={handleSelectTask}
        />
      ) : (
        <TaskGrid
          tasks={filteredTasks}
          onSelectTask={handleSelectTask}
        />
      )}
      
      {/* Add simple task info selection message */}
      {selectedTaskId && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-sm">
            Tarefa selecionada: <span className="font-medium">{
              completedTasks.find(task => task.id === selectedTaskId)?.title
            }</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Na próxima fase, implementaremos uma visualização detalhada da tarefa.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskHistoryNewPage;
