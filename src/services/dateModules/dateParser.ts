
import { parseISO, parse, isValid } from 'date-fns';
import { ISODateString } from '@/types/dates';
import { logError } from '@/utils/logUtils';

/**
 * Converte uma string ISO ou objeto Date para um objeto Date
 * Melhorada com tratamento de erro robusto
 * @returns Date objeto ou null se inválido
 */
export function parseDate(date: Date | ISODateString | null | undefined): Date | null {
  if (!date) return null;
  
  try {
    // Se já for um Date, verificamos se é válido
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }
    
    // Se for string, tentamos converter para Date
    if (typeof date === 'string') {
      // Tenta padrão ISO primeiro
      try {
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch (err) {
        // Silently continue to next format
      }
      
      // Tenta formatos alternativos (DD/MM/YYYY)
      if (date.includes('/')) {
        try {
          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          if (isValid(parsedDate)) {
            return parsedDate;
          }
        } catch (err) {
          // Silently continue to next format
        }
      }
      
      // Tenta formato timestamp numérico
      if (!isNaN(Number(date))) {
        try {
          const timestamp = Number(date);
          const parsedDate = new Date(timestamp);
          if (isValid(parsedDate)) {
            return parsedDate;
          }
        } catch (err) {
          // Silently continue
        }
      }
    }
    
    // Se chegou aqui, não conseguimos obter um Date válido
    logError('DateParser', 'Data inválida:', date);
    return null;
  } catch (error) {
    logError('DateParser', 'Erro ao analisar data:', error);
    return null;
  }
}

/**
 * Verifica se uma data é válida
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
 */
export function parseDateWithFallback(date: Date | ISODateString | null | undefined, fallback: Date = new Date()): Date {
  const parsed = parseDate(date);
  return parsed || fallback;
}
