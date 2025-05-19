
import { parseDate } from './dateParser';
import { formatDateDistance } from './dateFormatter';
import { isSameDate, isDateBefore, isDateAfter } from './dateOperations';
import { ISODateString } from '@/types/dates';

/**
 * Interface para resultado da comparação de datas
 */
export interface DateComparisonResult {
  isEqual: boolean;
  isBefore: boolean;
  isAfter: boolean;
  diffInDays: number;
  diffInHours: number;
  diffInMinutes: number;
  diffInSeconds: number;
  humanReadableDiff: string;
}

/**
 * Compara duas datas e retorna informações detalhadas sobre a comparação
 */
export function compareDates(
  date1: Date | ISODateString | null | undefined, 
  date2: Date | ISODateString | null | undefined
): DateComparisonResult {
  const emptyResult: DateComparisonResult = {
    isEqual: false,
    isBefore: false,
    isAfter: false,
    diffInDays: 0,
    diffInHours: 0,
    diffInMinutes: 0,
    diffInSeconds: 0,
    humanReadableDiff: ''
  };

  if (!date1 || !date2) {
    return emptyResult;
  }
  
  try {
    const parsed1 = parseDate(date1);
    const parsed2 = parseDate(date2);
    
    if (!parsed1 || !parsed2) {
      return emptyResult;
    }
    
    const datesAreEqual = isSameDate(parsed1, parsed2);
    const firstIsBeforeSecond = isDateBefore(parsed1, parsed2);
    const firstIsAfterSecond = isDateAfter(parsed1, parsed2);
    
    const diffInMillis = Math.abs(parsed2.getTime() - parsed1.getTime());
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    const humanReadableDiff = formatDateDistance(parsed1, parsed2);
    
    return {
      isEqual: datesAreEqual,
      isBefore: firstIsBeforeSecond,
      isAfter: firstIsAfterSecond,
      diffInDays,
      diffInHours,
      diffInMinutes,
      diffInSeconds,
      humanReadableDiff
    };
  } catch (error) {
    console.error('Erro ao comparar datas:', error);
    return emptyResult;
  }
}
