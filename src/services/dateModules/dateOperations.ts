
import { 
  addDays, 
  differenceInDays, 
  startOfDay as fnsStartOfDay, 
  endOfDay as fnsEndOfDay,
  isSameDay,
  isToday as fnsIsToday,
  isYesterday as fnsIsYesterday,
  isBefore, 
  isAfter
} from 'date-fns';
import { parseDate } from './dateParser';

/**
 * Adiciona ou subtrai dias a uma data
 */
export function addDaysToDate(date: Date | null | undefined, days: number): Date | null {
  if (!date) return null;
  const parsedDate = parseDate(date);
  if (!parsedDate) return null;
  
  return addDays(parsedDate, days);
}

/**
 * Obtém a diferença em dias entre duas datas
 */
export function getDaysDifference(date1: Date | null | undefined, date2: Date | null | undefined): number | null {
  if (!date1 || !date2) return null;
  
  const parsed1 = parseDate(date1);
  const parsed2 = parseDate(date2);
  
  if (!parsed1 || !parsed2) return null;
  
  return differenceInDays(parsed1, parsed2);
}

/**
 * Verifica se duas datas são no mesmo dia (ignorando hora)
 */
export function isSameDate(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
  if (!date1 || !date2) return false;
  
  const parsed1 = parseDate(date1);
  const parsed2 = parseDate(date2);
  
  if (!parsed1 || !parsed2) return false;
  
  return isSameDay(parsed1, parsed2);
}

/**
 * Verifica se a data é hoje
 */
export function isToday(date: Date | null | undefined): boolean {
  if (!date) return false;
  const parsedDate = parseDate(date);
  if (!parsedDate) return false;
  
  return fnsIsToday(parsedDate);
}

/**
 * Verifica se a data é ontem
 */
export function isYesterday(date: Date | null | undefined): boolean {
  if (!date) return false;
  const parsedDate = parseDate(date);
  if (!parsedDate) return false;
  
  return fnsIsYesterday(parsedDate);
}

/**
 * Retorna o início do dia (00:00:00)
 */
export function startOfDay(date: Date | null | undefined): Date | null {
  if (!date) return null;
  const parsedDate = parseDate(date);
  if (!parsedDate) return null;
  
  return fnsStartOfDay(parsedDate);
}

/**
 * Retorna o fim do dia (23:59:59)
 */
export function endOfDay(date: Date | null | undefined): Date | null {
  if (!date) return null;
  const parsedDate = parseDate(date);
  if (!parsedDate) return null;
  
  return fnsEndOfDay(parsedDate);
}

/**
 * Verifica se uma data é anterior a outra
 */
export function isDateBefore(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
  if (!date1 || !date2) return false;
  
  const parsed1 = parseDate(date1);
  const parsed2 = parseDate(date2);
  
  if (!parsed1 || !parsed2) return false;
  
  return isBefore(parsed1, parsed2);
}

/**
 * Verifica se uma data é posterior a outra
 */
export function isDateAfter(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
  if (!date1 || !date2) return false;
  
  const parsed1 = parseDate(date1);
  const parsed2 = parseDate(date2);
  
  if (!parsed1 || !parsed2) return false;
  
  return isAfter(parsed1, parsed2);
}

/**
 * Verifica se uma data é anterior à data atual (tarefa vencida)
 */
export function isTaskOverdue(date: Date | string | null): boolean {
  if (!date) return false;
  
  try {
    const dateToCompare = parseDate(date);
    
    if (!dateToCompare) {
      return false;
    }
    
    return isBefore(dateToCompare, new Date());
  } catch (error) {
    console.error('Erro ao verificar se tarefa está vencida:', error);
    return false;
  }
}
