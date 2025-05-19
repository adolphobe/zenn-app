
import { parseISO, parse, isValid } from 'date-fns';
import { ISODateString } from '@/types/dates';

/**
 * Converte uma string ISO ou objeto Date para um objeto Date
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
        console.debug('Não foi possível converter como ISO:', date);
      }
      
      // Tenta formatos alternativos (DD/MM/YYYY)
      if (date.includes('/')) {
        try {
          const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
          if (isValid(parsedDate)) {
            return parsedDate;
          }
        } catch (err) {
          console.debug('Não foi possível converter como dd/MM/yyyy:', date);
        }
      }
    }
    
    // Se chegou aqui, não conseguimos obter um Date válido
    console.warn('Data inválida:', date);
    return null;
  } catch (error) {
    console.error('Erro ao analisar data:', error);
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
    console.error('Erro ao validar data:', error);
    return false;
  }
}
