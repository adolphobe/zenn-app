
import { 
  formatInTimeZone as fnsFormatInTimeZone, 
  toZonedTime as fnsToZonedTime, 
  fromZonedTime as fnsFromZonedTime,
  getTimezoneOffset as fnsGetTimezoneOffset
} from 'date-fns-tz';
import { ISODateString } from '@/types/dates';
import { parseDate } from './dateParser';

// Estado global para o fuso horário padrão
let defaultTimeZone = 'America/Sao_Paulo';

/**
 * Define o fuso horário padrão
 */
export function setDefaultTimeZone(timeZone: string): void {
  defaultTimeZone = timeZone;
}

/**
 * Obtém o fuso horário padrão atual
 */
export function getDefaultTimeZone(): string {
  return defaultTimeZone;
}

/**
 * Formata uma data em um fuso horário específico
 */
export function formatInTimeZone(
  date: Date | ISODateString | null | undefined,
  format: string,
  timeZone: string = defaultTimeZone,
  options: any = {}
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    return fnsFormatInTimeZone(parsedDate, timeZone, format, options);
  } catch (error) {
    console.error('Erro formatando data no fuso horário:', error);
    return '';
  }
}

/**
 * Converte uma data para um fuso horário específico
 */
export function toZonedTime(
  date: Date | ISODateString | null | undefined,
  timeZone: string = defaultTimeZone
): Date | null {
  if (!date) return null;
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return null;
    
    return fnsToZonedTime(parsedDate, timeZone);
  } catch (error) {
    console.error('Erro convertendo data para fuso horário:', error);
    return null;
  }
}

/**
 * Converte uma data de um fuso horário específico para UTC
 */
export function fromZonedTime(
  date: Date | ISODateString | null | undefined,
  timeZone: string = defaultTimeZone
): Date | null {
  if (!date) return null;
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return null;
    
    return fnsFromZonedTime(parsedDate, timeZone);
  } catch (error) {
    console.error('Erro convertendo data do fuso horário para UTC:', error);
    return null;
  }
}

/**
 * Retorna o deslocamento do fuso horário em minutos
 */
export function getTimezoneOffset(
  timeZone: string = defaultTimeZone,
  date: Date = new Date()
): number {
  try {
    return fnsGetTimezoneOffset(timeZone, date);
  } catch (error) {
    console.error('Erro obtendo deslocamento do fuso horário:', error);
    return 0;
  }
}

/**
 * Detecta automaticamente o fuso horário local do usuário
 */
export function detectLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Erro ao detectar fuso horário local:', error);
    return 'America/Sao_Paulo'; // Default para Brasil
  }
}
