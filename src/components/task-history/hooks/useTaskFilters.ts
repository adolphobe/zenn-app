
import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types';
import { dateService } from '@/services/dateService';
import { logError } from '@/utils/logUtils';

// Definição de tipo para opções de filtro
interface FilterOptions {
  searchQuery: string;
  periodFilter: string;
  scoreFilter: string;
  feedbackFilter: string;
  pillarFilter: string;
  startDate?: Date;
  endDate?: Date;
  sortBy: string;
  showFilters: boolean;
}

/**
 * Hook otimizado para filtrar tarefas com tratamento apropriado de estado
 */
export const useTaskFilters = (
  tasks: Task[],
  initialFilters: FilterOptions
) => {
  // Usa os valores iniciais de filtro das props
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [periodFilter, setPeriodFilter] = useState(initialFilters.periodFilter);
  const [scoreFilter, setScoreFilter] = useState(initialFilters.scoreFilter);
  const [feedbackFilter, setFeedbackFilter] = useState(initialFilters.feedbackFilter);
  const [pillarFilter, setPillarFilter] = useState(initialFilters.pillarFilter);
  const [startDate, setStartDate] = useState<Date | undefined>(initialFilters.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialFilters.endDate);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [showFilters, setShowFilters] = useState(initialFilters.showFilters);

  // Filtra tarefas com base na consulta de busca e filtros - com memoização adequada
  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    try {
      return tasks.filter((task) => {
        // Aplica filtro de busca - apenas no título para performance
        const matchesSearch = !searchQuery || 
          task.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // Aplica filtro de período com verificação otimizada
        let matchesPeriod = true;
        if (periodFilter !== 'all') {
          // Garante que temos uma data válida
          if (!task.completedAt) return false;
          
          const completedAt = task.completedAt instanceof Date 
            ? task.completedAt 
            : dateService.parseDate(task.completedAt);
          
          if (!completedAt) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          
          switch (periodFilter) {
            case 'today':
              matchesPeriod = completedAt >= today;
              break;
            case 'week':
              matchesPeriod = completedAt >= weekStart;
              break;
            case 'month':
              matchesPeriod = completedAt >= monthStart;
              break;
            case 'custom':
              if (startDate && completedAt < startDate) matchesPeriod = false;
              if (endDate) {
                const nextDay = new Date(endDate);
                nextDay.setDate(endDate.getDate() + 1);
                if (completedAt >= nextDay) matchesPeriod = false;
              }
              break;
          }
        }
        if (!matchesPeriod) return false;

        // Aplica filtro de pontuação
        let matchesScore = true;
        if (scoreFilter !== 'all') {
          const totalScore = task.totalScore || 0;
          switch (scoreFilter) {
            case 'high':
              matchesScore = totalScore >= 12;
              break;
            case 'medium':
              matchesScore = totalScore >= 8 && totalScore < 12;
              break;
            case 'low':
              matchesScore = totalScore < 8;
              break;
          }
        }
        if (!matchesScore) return false;

        // Aplica filtro de feedback
        const matchesFeedback = feedbackFilter === 'all' || task.feedback === feedbackFilter;
        if (!matchesFeedback) return false;

        // Aplica filtro de pilar
        let matchesPillar = true;
        if (pillarFilter !== 'all') {
          const scores = {
            'consequence': task.consequenceScore || 0,
            'pride': task.prideScore || 0,
            'construction': task.constructionScore || 0,
          };

          const highestScore = Math.max(...Object.values(scores));
          matchesPillar = scores[pillarFilter as keyof typeof scores] === highestScore;
        }

        return matchesPillar;
      });
    } catch (err) {
      logError('useTaskFilters', 'Erro filtrando tarefas:', err);
      return []; // Array vazio em caso de erro
    }
  }, [
    tasks, 
    searchQuery, 
    periodFilter, 
    scoreFilter, 
    feedbackFilter, 
    pillarFilter, 
    startDate, 
    endDate
  ]);

  // Ordena tarefas filtradas com memoização própria
  const sortedTasks = useMemo(() => {
    if (!filteredTasks.length) return [];
    
    try {
      return [...filteredTasks].sort((a, b) => {
        const aDate = a.completedAt instanceof Date ? a.completedAt : new Date();
        const bDate = b.completedAt instanceof Date ? b.completedAt : new Date();
        
        switch (sortBy) {
          case 'newest':
            return (+bDate) - (+aDate);
          case 'oldest':
            return (+aDate) - (+bDate);
          case 'highScore':
            return (b.totalScore || 0) - (a.totalScore || 0);
          case 'lowScore':
            return (a.totalScore || 0) - (b.totalScore || 0);
          case 'alphabetical':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    } catch (err) {
      logError('useTaskFilters', 'Erro ordenando tarefas:', err);
      return [...filteredTasks]; // Retorna array não ordenado em caso de erro
    }
  }, [filteredTasks, sortBy]);

  return {
    // Estado e setters para filtros
    searchQuery, setSearchQuery,
    periodFilter, setPeriodFilter,
    scoreFilter, setScoreFilter,
    feedbackFilter, setFeedbackFilter,
    pillarFilter, setPillarFilter,
    startDate, setStartDate,
    endDate, setEndDate,
    sortBy, setSortBy,
    showFilters, setShowFilters,
    
    // Resultados computados
    filteredTasks,
    sortedTasks
  };
};
