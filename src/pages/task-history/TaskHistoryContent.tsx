
import React, { useState, useMemo, useCallback } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logError } from '@/utils/logUtils';
import { Task } from '@/types';

// Import hooks otimizados
import { useTaskFilters } from '@/components/task-history/hooks/useTaskFilters';
import { useTaskPagination } from '@/components/task-history/hooks/useTaskPagination';

// Import componentes
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
  
  // Inicializa variáveis de estado para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Cria array de tarefas validadas usando memo para evitar recálculos
  const validatedTasks = useMemo(() => {
    if (!completedTasks.length) return [];
    
    // Cópia defensiva de tarefas com datas validadas
    return completedTasks.map(task => ({
      ...task,
      // Garante que completedAt é uma data válida
      completedAt: task.completedAt instanceof Date && !isNaN(task.completedAt.getTime())
        ? task.completedAt
        : new Date() // Usa data atual como fallback
    }));
  }, [completedTasks]);
  
  // Tenta processar filtros e paginação com tratamento de erros melhorado
  const {
    filteredTasks,
    sortedTasks,
    // Re-exporta setters para os componentes filhos
    setSearchQuery: handleSearchChange,
    setPeriodFilter: handlePeriodChange,
    setScoreFilter: handleScoreChange,
    setFeedbackFilter: handleFeedbackChange,
    setPillarFilter: handlePillarChange,
    setStartDate: handleStartDateChange,
    setEndDate: handleEndDateChange,
    setSortBy: handleSortChange,
    setShowFilters: handleToggleFilters,
  } = useTaskFilters(validatedTasks, {
    searchQuery,
    periodFilter,
    scoreFilter,
    feedbackFilter,
    pillarFilter,
    startDate,
    endDate,
    sortBy,
    showFilters
  });

  // Usa hook de paginação apenas se temos tarefas filtradas
  const pagination = useMemo(() => {
    try {
      if (!sortedTasks.length) {
        return {
          currentPage: 1,
          totalPages: 1,
          paginatedTasks: [],
          groupedTasks: [],
          handlePageChange: () => {},
          getPageNumbers: () => []
        };
      }
      
      return useTaskPagination(sortedTasks, periodFilter);
    } catch (err) {
      logError('TaskHistory', 'Erro na paginação:', err);
      setError(`Erro ao processar paginação: ${err instanceof Error ? err.message : String(err)}`);
      
      // Valores fallback em caso de erro
      return {
        currentPage: 1,
        totalPages: 1,
        paginatedTasks: [],
        groupedTasks: [],
        handlePageChange: () => {},
        getPageNumbers: () => []
      };
    }
  }, [sortedTasks, periodFilter, setError]);
  
  // Desempacotar valores da paginação
  const { 
    currentPage, 
    totalPages, 
    paginatedTasks, 
    groupedTasks, 
    handlePageChange, 
    getPageNumbers 
  } = pagination;

  // Handler para gerenciar erros
  const handleError = useCallback((error: unknown) => {
    logError('TaskHistory', 'Erro ao processar tarefas:', error);
    setError(`Erro ao processar o histórico de tarefas: ${error instanceof Error ? error.message : String(error)}`);
  }, [setError]);

  // Tenta renderizar com proteção contra erros
  try {
    return (
      <div className="container p-4 mx-auto">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Histórico de Tarefas</h1>
          
          {/* Exibe contagem de tarefas mesmo se houver erro */}
          <div className="text-muted-foreground">
            {completedTasks.length > 0 ? 
              `${completedTasks.length} ${completedTasks.length === 1 ? 'tarefa concluída' : 'tarefas concluídas'}` : 
              'Nenhuma tarefa concluída para exibir'
            }
          </div>
          
          {/* Passa tarefas filtradas para TaskHistoryStats */}
          {sortedTasks.length > 0 && (
            <TaskHistoryStats filteredTasks={sortedTasks} />
          )}
          
          {/* Barra de busca e filtro */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TaskSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              showFilters={showFilters}
              setShowFilters={handleToggleFilters}
            />
            
            <div className="flex gap-2">
              <TaskFiltersToggle 
                showFilters={showFilters}
                setShowFilters={handleToggleFilters}
              />
              
              <ViewToggle 
                viewMode={viewMode}
                setViewMode={setViewMode}
                sortBy={sortBy}
                setSortBy={handleSortChange}
              />
            </div>
          </div>
          
          {/* Filtros avançados */}
          {showFilters && (
            <AdvancedFilters
              periodFilter={periodFilter}
              setPeriodFilter={handlePeriodChange}
              scoreFilter={scoreFilter}
              setScoreFilter={handleScoreChange}
              feedbackFilter={feedbackFilter}
              setFeedbackFilter={handleFeedbackChange}
              pillarFilter={pillarFilter}
              setPillarFilter={handlePillarChange}
              startDate={startDate}
              setStartDate={handleStartDateChange}
              endDate={endDate}
              setEndDate={handleEndDateChange}
            />
          )}

          {/* Mensagem sem resultados */}
          {(sortedTasks.length === 0 || completedTasks.length === 0) && <NoTasksMessage />}
          
          {/* Visualização em lista */}
          {viewMode === 'list' && paginatedTasks.length > 0 && <TasksTable tasks={paginatedTasks} />}
          
          {/* Visualização em grade com agrupamento por linha do tempo */}
          {viewMode === 'grid' && paginatedTasks.length > 0 && <TaskGroupGrid groups={groupedTasks} />}
          
          {/* Paginação */}
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
  } catch (error) {
    handleError(error);
    return (
      <div className="container p-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Histórico de Tarefas</h1>
        <div className="text-red-500">
          Erro ao carregar o histórico de tarefas. Por favor, tente novamente.
        </div>
      </div>
    );
  }
};
