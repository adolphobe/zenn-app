
import { Task, DateDisplayOptions, ViewMode, SortOption } from './types';

export const formatDate = (date: Date | null, options?: DateDisplayOptions): string => {
  if (!date) return '';
  
  // Ensure we have a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
  
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

// Helper function to safely create a Date object
export const safeParseDate = (dateInput: string | Date | null | undefined): Date | null => {
  if (!dateInput) return null;
  
  try {
    // If it's already a Date object with a valid time
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      return dateInput;
    }
    
    // If it's a string, try to parse it
    if (typeof dateInput === 'string') {
      const parsedDate = new Date(dateInput);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    
    // If we get here, the date is invalid
    console.warn('Invalid date value:', dateInput);
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

export const sortTasks = (
  tasks: Task[], 
  viewMode: ViewMode, 
  options: SortOption
): Task[] => {
  const { sortDirection, noDateAtEnd } = options;
  
  // Create a safe copy of the tasks with validated dates
  const safeTasks = tasks.map(task => ({
    ...task,
    idealDate: task.idealDate ? safeParseDate(task.idealDate) : null,
    createdAt: task.createdAt ? safeParseDate(task.createdAt) : new Date(),
    completedAt: task.completedAt ? safeParseDate(task.completedAt) : null
  }));
  
  return safeTasks.sort((a, b) => {
    const sortMultiplier = sortDirection === 'desc' ? -1 : 1;
    const now = new Date();
    
    if (viewMode === 'power') {
      // Power mode - sort by score first
      if (a.totalScore !== b.totalScore) {
        return (a.totalScore - b.totalScore) * sortMultiplier;
      }
      
      // Secondary sort by date if scores are equal
      if (a.idealDate && b.idealDate) return (a.idealDate.getTime() - b.idealDate.getTime());
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
        
        // Para tarefas vencidas e não vencidas, usamos a mesma lógica de ordenação
        // Se sortDirection for 'desc' (mais recente primeiro):
        //   - Para tarefas futuras (não vencidas), o "mais recente" é a data mais próxima de hoje (19/05 vem antes de 25/05)
        //   - Para tarefas passadas (vencidas), o "mais recente" é a data mais próxima de hoje (15/05 vem antes de 10/05)
        // Se sortDirection for 'asc' (mais antigo primeiro), a lógica é invertida
        
        // No modo cronológico, tratamos a proximidade com o presente 
        const nowTime = now.getTime();
        
        if (isTaskOverdue(a.idealDate) && isTaskOverdue(b.idealDate)) {
          // Ambas são vencidas, a mais "recente" é a mais próxima de hoje
          if (sortDirection === 'desc') {
            return (bTime - aTime); // Mais próxima do presente primeiro (ordem decrescente)
          } else {
            return (aTime - bTime); // Mais distante do presente primeiro (ordem crescente)
          }
        } else if (!isTaskOverdue(a.idealDate) && !isTaskOverdue(b.idealDate)) {
          // Ambas são futuras, a mais "recente" é a mais próxima de hoje
          if (sortDirection === 'desc') {
            return (aTime - bTime); // Mais próxima do presente primeiro (ordem crescente)
          } else {
            return (bTime - aTime); // Mais distante do presente primeiro (ordem decrescente)
          }
        } else {
          // Uma é vencida e outra é futura - este caso não deveria ocorrer aqui
          // pois as tarefas já foram separadas, mas mantemos por segurança
          if (isTaskOverdue(a.idealDate)) return -1;
          return 1;
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

// Verifica se uma tarefa está vencida (antes da data/hora atual)
export const isTaskOverdue = (date: Date | null): boolean => {
  if (!date) return false;
  
  // Ensure we have a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  
  const now = new Date();
  return date < now;
};
