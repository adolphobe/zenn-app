
import { Task, DateDisplayOptions, ViewMode, SortOption } from './types';

export const formatDate = (date: Date | string | null, options?: DateDisplayOptions): string => {
  if (!date) return '';
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Ensure we have a valid Date object
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
  
  const { hideYear = false, hideTime = false, hideDate = false } = options || {};
  
  if (hideDate) return '';
  
  // Formatação da data no formato brasileiro
  let result = '';
  
  if (!hideDate) {
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    
    result = `${day}/${month}`;
    
    if (!hideYear) {
      const year = dateObj.getFullYear();
      result += `/${year}`;
    }
  }
  
  // Adicionar horário sem vírgula (formato 24 horas)
  if (!hideTime) {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
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
  
  // Create a safe copy of the tasks with validated dates but preserve original type structure
  // Use temporary type for internal processing
  type TaskWithParsedDates = {
    id: string;
    title: string;
    consequenceScore: number;
    prideScore: number;
    constructionScore: number;
    totalScore: number;
    idealDate: Date | null;
    hidden: boolean;
    completed: boolean;
    completedAt: Date | null;
    createdAt: Date;
    feedback: 'transformed' | 'relief' | 'obligation' | null;
    comments: any[];
    pillar?: string;
    operationLoading?: {
      [key: string]: boolean;
    };
  };
  
  // Parse dates for sorting while maintaining original task structure
  const tasksWithParsedDates: TaskWithParsedDates[] = tasks.map(task => ({
    ...task,
    idealDate: task.idealDate ? safeParseDate(task.idealDate) : null,
    createdAt: task.createdAt ? 
      (task.createdAt instanceof Date ? task.createdAt : safeParseDate(task.createdAt)) : 
      new Date(),
    completedAt: task.completedAt ? safeParseDate(task.completedAt) : null
  }));
  
  // Sort the parsed tasks
  const sortedParsedTasks = tasksWithParsedDates.sort((a, b) => {
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
  
  // Return the original tasks in the new sorted order
  // This preserves the original Task type structure including string-typed dates
  return sortedParsedTasks.map(parsedTask => {
    // Find the original task that matches this ID
    const originalTask = tasks.find(t => t.id === parsedTask.id);
    // We know it must exist since we created parsedTasks from tasks
    return originalTask as Task;
  });
};

// Adiciona ou subtrai dias a uma data
export const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Verifica se uma tarefa está vencida (antes da data/hora atual)
export const isTaskOverdue = (date: Date | string | null): boolean => {
  if (!date) return false;
  
  // Convert string to Date if necessary
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Ensure we have a valid Date object
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return false;
  }
  
  const now = new Date();
  return dateObj < now;
};
