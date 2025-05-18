
import { Task, DateDisplayOptions, ViewMode, SortOption } from './types';
import { dateService } from './services/dateService';

export const formatDate = (date: Date | string | null, options?: DateDisplayOptions): string => {
  if (!date) return '';
  
  // Converter para Date se for string
  const dateObj = dateService.parseDate(date);
  
  // Garantir que temos um objeto Date válido
  if (!dateObj) {
    console.warn('Data inválida fornecida para formatDate:', date);
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

// Agora usamos o dateService para o parsing seguro de datas
export const safeParseDate = dateService.parseDate;

// Utilizamos o dateService para funcionalidades relacionadas a datas
export const addDaysToDate = dateService.addDaysToDate;
export const isTaskOverdue = dateService.isTaskOverdue;

export const sortTasks = (
  tasks: Task[], 
  viewMode: ViewMode, 
  options: SortOption
): Task[] => {
  const { sortDirection, noDateAtEnd } = options;
  
  // Criar uma cópia das tarefas para ordenação
  const tasksCopy = [...tasks];
  
  // Ordenar as tarefas copiadas
  return tasksCopy.sort((a, b) => {
    const sortMultiplier = sortDirection === 'desc' ? -1 : 1;
    const now = new Date();
    
    if (viewMode === 'power') {
      // Modo power - ordenar por pontuação primeiro
      if (a.totalScore !== b.totalScore) {
        return (a.totalScore - b.totalScore) * sortMultiplier;
      }
      
      // Ordenação secundária por data se pontuações forem iguais
      const aDate = a.idealDate ? new Date(a.idealDate) : null;
      const bDate = b.idealDate ? new Date(b.idealDate) : null;
      
      if (aDate && bDate) return (aDate.getTime() - bDate.getTime());
      if (aDate) return -1;
      if (bDate) return 1;
      return 0;
      
    } else {
      // Modo cronológico
      // Lidar com tarefas sem datas com base na configuração noDateAtEnd
      if (noDateAtEnd) {
        if (a.idealDate && !b.idealDate) return -1;
        if (!a.idealDate && b.idealDate) return 1;
      }
      
      // Ambas têm datas, ordenar por valor de data com base na direção
      if (a.idealDate && b.idealDate) {
        const aDate = new Date(a.idealDate);
        const bDate = new Date(b.idealDate);
        const aTime = aDate.getTime();
        const bTime = bDate.getTime();
        
        // No modo cronológico, tratamos a proximidade com o presente
        const nowTime = now.getTime();
        
        if (dateService.isTaskOverdue(aDate) && dateService.isTaskOverdue(bDate)) {
          // Ambas são vencidas, a mais "recente" é a mais próxima de hoje
          if (sortDirection === 'desc') {
            return (bTime - aTime); // Mais próxima do presente primeiro (ordem decrescente)
          } else {
            return (aTime - bTime); // Mais distante do presente primeiro (ordem crescente)
          }
        } else if (!dateService.isTaskOverdue(aDate) && !dateService.isTaskOverdue(bDate)) {
          // Ambas são futuras, a mais "recente" é a mais próxima de hoje
          if (sortDirection === 'desc') {
            return (aTime - bTime); // Mais próxima do presente primeiro (ordem crescente)
          } else {
            return (bTime - aTime); // Mais distante do presente primeiro (ordem decrescente)
          }
        } else {
          // Uma é vencida e outra é futura - este caso não deveria ocorrer aqui
          // pois as tarefas já foram separadas, mas mantemos por segurança
          if (dateService.isTaskOverdue(aDate)) return -1;
          return 1;
        }
      }
      
      // Se uma tem data e outra não
      if (a.idealDate && !b.idealDate) return -1;
      if (!a.idealDate && b.idealDate) return 1;
      
      // Se ambas não têm datas, usar pontuação como ordenação secundária
      return (b.totalScore - a.totalScore);
    }
  });
};

