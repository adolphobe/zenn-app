
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
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { logDateInfo } from '@/utils/diagnosticLog';
import { useTaskDataContext } from '@/context/TaskDataProvider';

const TaskHistory = () => {
  const { state } = useAppContext();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [error, setError] = useState<string | null>(null);
  
  // Use the TaskDataContext instead of useCompletedTasks
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const isLoading = completedTasksLoading || authLoading;
  
  useEffect(() => {
    console.log('TaskHistory: Montado, verificando autenticação...', { isAuthenticated, authLoading });
    logDateInfo('TaskHistory', 'Página de histórico montada', new Date());
    
    if (completedTasks.length > 0) {
      // Log the first few tasks to help diagnose date issues
      completedTasks.slice(0, 3).forEach(task => {
        logDateInfo('TaskHistory', `Task ${task.id} completedAt in list`, task.completedAt);
      });
    } else {
      console.log('TaskHistory: Sem tarefas concluídas para mostrar');
    }
    
    // Verificar se temos uma URL com duplicação do path
    const currentUrl = window.location.href;
    if (currentUrl.includes('/task-history#/task-history')) {
      console.warn('TaskHistory: URL com duplicação detectada', currentUrl);
    }
  }, [isAuthenticated, authLoading, completedTasks]);
  
  // Usar um try/catch para envolver o uso dos hooks de filtro e paginação
  // para capturar possíveis erros na manipulação de datas
  let filteredTasks = [];
  let sortedTasks = [];
  let groupedTasks = [];
  let paginatedTasks = [];
  let currentPage = 1;
  let totalPages = 1;
  let searchQuery = '';
  let periodFilter = 'all';
  let showFilters = false;
  let scoreFilter = 'all';
  let feedbackFilter = 'all';
  let pillarFilter = 'all';
  let startDate = null;
  let endDate = null;
  let sortBy = 'newest';
  
  const setSearchQuery = () => {};
  const setPeriodFilter = () => {};
  const setScoreFilter = () => {};
  const setFeedbackFilter = () => {};
  const setPillarFilter = () => {};
  const setStartDate = () => {};
  const setEndDate = () => {};
  const setSortBy = () => {};
  const setShowFilters = () => {};
  const handlePageChange = () => {};
  const getPageNumbers = () => [];
  
  try {
    // Usar os hooks de filtro e paginação se tivermos tarefas para processar
    if (completedTasks.length > 0) {
      const filters = useTaskFilters(completedTasks);
      searchQuery = filters.searchQuery;
      periodFilter = filters.periodFilter;
      scoreFilter = filters.scoreFilter;
      feedbackFilter = filters.feedbackFilter;
      pillarFilter = filters.pillarFilter;
      startDate = filters.startDate;
      endDate = filters.endDate;
      sortBy = filters.sortBy;
      showFilters = filters.showFilters;
      filteredTasks = filters.filteredTasks;
      sortedTasks = filters.sortedTasks;
      
      // Spread operators para copiar métodos
      ({
        setSearchQuery, setPeriodFilter, setScoreFilter,
        setFeedbackFilter, setPillarFilter, setStartDate,
        setEndDate, setSortBy, setShowFilters
      } = filters);
      
      // Agora usar o hook de paginação com os resultados filtrados
      const pagination = useTaskPagination(sortedTasks, periodFilter);
      currentPage = pagination.currentPage;
      totalPages = pagination.totalPages;
      paginatedTasks = pagination.paginatedTasks;
      groupedTasks = pagination.groupedTasks;
      handlePageChange = pagination.handlePageChange;
      getPageNumbers = pagination.getPageNumbers;
    }
  } catch (err) {
    console.error('Erro ao processar tarefas no TaskHistory:', err);
    setError(`Erro ao processar o histórico de tarefas: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (isLoading) {
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
        <h1 className="text-2xl font-bold">Histórico de Tarefas</h1>
        
        {/* Pass filtered tasks to TaskHistoryStats instead of all completed tasks */}
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
            pageNumbers={getPageNumbers()}
          />
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
