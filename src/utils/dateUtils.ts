
/**
 * Utilitários de data para uso em toda a aplicação
 * Este arquivo exporta funções do dateService para uso em componentes
 * Sempre use estas funções ou dateService diretamente, evite manipulação direta de datas
 */

import { dateService } from '@/services/dateService';

// Re-exporta funções do dateService para uso direto
export const {
  parseDate,
  toISOString,
  formatForDisplay,
  formatForDateTimeInput,
  isTaskOverdue,
  addDaysToDate,
  isSameDate,
  getDaysDifference,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay
} = dateService;

/**
 * Formata uma data para exibição amigável relativa
 * Ex: "Hoje", "Ontem", "Há 3 dias"
 */
export const getRelativeDateDisplay = (date: Date | string | null): string => {
  if (!date) return '';
  
  const parsedDate = dateService.parseDate(date);
  if (!parsedDate) return '';
  
  if (dateService.isToday(parsedDate)) {
    return 'Hoje';
  }
  
  if (dateService.isYesterday(parsedDate)) {
    return 'Ontem';
  }
  
  const daysDiff = dateService.getDaysDifference(new Date(), parsedDate);
  if (daysDiff !== null && daysDiff <= 7) {
    return `Há ${daysDiff} ${daysDiff === 1 ? 'dia' : 'dias'}`;
  }
  
  // Para datas mais antigas, use o formato padrão
  return dateService.formatForDisplay(parsedDate);
};
