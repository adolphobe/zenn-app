
import { Task, DateDisplayOptions, ViewMode, SortOption } from './types';

export const formatDate = (date: Date | null, options?: DateDisplayOptions): string => {
  if (!date) return '';
  
  const { hideYear = false, hideTime = false, hideDate = false } = options || {};
  
  if (hideDate) return '';
  
  // Formatação da data no formato brasileiro
  let result = '';
  
  if (!hideDate) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    result = `${day}/${month}`;
    
    if (!hideYear) {
      const year = date.getFullYear();
      result += `/${year}`;
    }
  }
  
  // Adicionar horário sem vírgula (formato 24 horas)
  if (!hideTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (result) {
      result += ' '; // Espaço em vez de vírgula
    }
    
    result += `${hours}:${minutes}`;
  }
  
  return result;
};

export const getTaskPriorityClass = (score: number): string => {
  if (score >= 14) return 'task-critical';
  if (score >= 11) return 'task-important';
  if (score >= 8) return 'task-moderate';
  return 'task-light';
};

export const sortTasks = (
  tasks: Task[], 
  viewMode: ViewMode, 
  options: SortOption
): Task[] => {
  const { sortDirection, noDateAtEnd } = options;
  
  return [...tasks].sort((a, b) => {
    const sortMultiplier = sortDirection === 'desc' ? -1 : 1;
    
    if (viewMode === 'power') {
      // Sort by score according to direction
      if (a.totalScore !== b.totalScore) {
        return (a.totalScore - b.totalScore) * sortMultiplier;
      }
      
      // Secondary sort by date if scores are equal
      if (a.idealDate && b.idealDate) return a.idealDate.getTime() - b.idealDate.getTime();
      if (a.idealDate) return -1;
      if (b.idealDate) return 1;
      return 0;
      
    } else {
      // Chronological mode
      // Handle tasks without dates based on noDateAtEnd setting
      if (noDateAtEnd) {
        if (a.idealDate && !b.idealDate) return -1;
        if (!a.idealDate && b.idealDate) return 1;
      }
      
      // Both have dates, sort by date value based on direction
      if (a.idealDate && b.idealDate) {
        const aTime = a.idealDate.getTime();
        const bTime = b.idealDate.getTime();
        
        // Consistent chronological order based on sortDirection
        return (aTime - bTime) * sortMultiplier;
      }
      
      // If one has date and other doesn't
      if (a.idealDate && !b.idealDate) return -1;
      if (!a.idealDate && b.idealDate) return 1;
      
      // If both don't have dates, use score as secondary sort
      return (b.totalScore - a.totalScore);
    }
  });
};

// Adiciona ou subtrai dias a uma data
export const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Verifica se uma tarefa está vencida (antes da data/hora atual)
export const isTaskOverdue = (date: Date | null): boolean => {
  if (!date) return false;
  const now = new Date();
  return date < now;
};
