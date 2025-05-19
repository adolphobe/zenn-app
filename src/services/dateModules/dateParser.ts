
import { parseISO, parse, isValid } from 'date-fns';
import { ISODateString } from '@/types/dates';
import { logError } from '@/utils/logUtils';

// Cache for already parsed dates to avoid redundant processing
const dateCache = new Map<string, Date | null>();

/**
 * Converte uma string ISO ou objeto Date para um objeto Date
 * Melhorada com tratamento de erro robusto e cache de resultados
 * @returns Date objeto ou null se inválido
 */
export function parseDate(date: Date | ISODateString | null | undefined): Date | null {
  if (!date) return null;
  
  try {
    // Se já for um Date, verificamos se é válido
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }
    
    // Se for string, verificamos o cache primeiro
    if (typeof date === 'string') {
      // Check cache for this string
      if (dateCache.has(date)) {
        return dateCache.get(date) || null;
      }
      
      // Try ISO format first (most common)
      try {
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
          dateCache.set(date, parsedDate);
          return parsedDate;
        }
      } catch (err) {
        // Silently continue to next format
      }
      
      // Try alternative formats (DD/MM/YYYY)
      if (date.includes('/')) {
        try {
          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          if (isValid(parsedDate)) {
            dateCache.set(date, parsedDate);
            return parsedDate;
          }
        } catch (err) {
          // Silently continue to next format
        }
      }
      
      // Try numeric timestamp format
      if (!isNaN(Number(date))) {
        try {
          const timestamp = Number(date);
          const parsedDate = new Date(timestamp);
          if (isValid(parsedDate)) {
            dateCache.set(date, parsedDate);
            return parsedDate;
          }
        } catch (err) {
          // Silently continue
        }
      }
      
      // No valid format found, cache null result
      dateCache.set(date, null);
    }
    
    // If we reached here, we couldn't get a valid Date
    return null;
  } catch (error) {
    logError('DateParser', 'Erro ao analisar data:', error);
    return null;
  }
}

/**
 * Cleans the date cache to prevent memory leaks
 */
export function clearDateCache() {
  dateCache.clear();
}

/**
 * Verifica se uma data é válida com tratamento de erros melhorado
 */
export function isDateValid(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  
  try {
    if (date instanceof Date) {
      return isValid(date);
    }
    
    if (typeof date === 'string') {
      const parsed = parseDate(date);
      return parsed !== null;
    }
    
    return false;
  } catch (error) {
    logError('DateParser', 'Erro ao validar data:', error);
    return false;
  }
}

/**
 * Função auxiliar para sempre retornar uma data válida
 * Útil quando precisamos garantir que uma operação tenha uma data mesmo em caso de erro
 * @param fallback Valor padrão se a data for inválida
 */
export function parseDateWithFallback(date: Date | ISODateString | null | undefined, fallback: Date = new Date()): Date {
  const parsed = parseDate(date);
  return parsed || fallback;
}
