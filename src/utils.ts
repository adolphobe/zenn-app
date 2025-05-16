
import { Task, DateDisplayOptions, ViewMode, SortDirection, SortOption } from './types';

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
      // If noDateAtEnd is enabled, push tasks without dates to the end
      if (noDateAtEnd) {
        if (a.idealDate && !b.idealDate) return -1;
        if (!a.idealDate && b.idealDate) return 1;
      }
      
      // Corrected chronological sorting
      if (a.idealDate && b.idealDate) {
        const now = new Date().getTime();
        
        if (sortDirection === 'asc') {
          // "Próximas primeiro" - closest dates to today first
          // For dates after today, closer is better
          // For dates before today, those are already past and should come after future dates
          const aFuture = a.idealDate.getTime() >= now;
          const bFuture = b.idealDate.getTime() >= now;
          
          if (aFuture && bFuture) {
            // Both in future, closest comes first
            return a.idealDate.getTime() - b.idealDate.getTime();
          } else if (!aFuture && !bFuture) {
            // Both in past, most recent comes first
            return b.idealDate.getTime() - a.idealDate.getTime();
          } else {
            // One past, one future - future comes first
            return aFuture ? -1 : 1;
          }
        } else {
          // "Distantes primeiro" - furthest dates from today first
          // For future dates, further is better
          // For past dates, older is better
          const aFuture = a.idealDate.getTime() >= now;
          const bFuture = b.idealDate.getTime() >= now;
          
          if (aFuture && bFuture) {
            // Both in future, furthest comes first
            return b.idealDate.getTime() - a.idealDate.getTime();
          } else if (!aFuture && !bFuture) {
            // Both in past, oldest comes first
            return a.idealDate.getTime() - b.idealDate.getTime();
          } else {
            // One past, one future - past comes first (it's further from "now")
            return aFuture ? 1 : -1;
          }
        }
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
