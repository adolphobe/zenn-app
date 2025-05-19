
import { format } from 'date-fns';
import { formatInTimeZone as fnsFormatInTimeZone, toZonedTime, fromZonedTime, getTimezoneOffset } from 'date-fns-tz';
import { parseDate } from './dateParser';

// Fuso horário padrão
let defaultTimeZone = 'America/Sao_Paulo';

/**
 * Define o fuso horário padrão para o sistema
 */
export function setDefaultTimeZone(timeZone: string): void {
  defaultTimeZone = timeZone;
  console.log(`Timezone padrão definido para: ${timeZone}`);
}

/**
 * Obtém o fuso horário padrão atual
 */
export function getDefaultTimeZone(): string {
  return defaultTimeZone;
}

/**
 * Formata uma data para exibição em um fuso horário específico
 * @param date Data a ser formatada
 * @param formatStr String de formato (ex: 'dd/MM/yyyy HH:mm')
 * @param timeZone Fuso horário (ex: 'America/Sao_Paulo')
 */
export function formatInTimeZone(
  date: Date | string | null | undefined,
  formatStr: string,
  timeZone?: string
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    // Use o fuso horário especificado ou o padrão
    const tz = timeZone || defaultTimeZone;
    
    return fnsFormatInTimeZone(parsedDate, tz, formatStr);
  } catch (error) {
    console.error('Erro formatando data no fuso horário:', error);
    return '';
  }
}

/**
 * Converte uma data UTC para uma data zonal
 * @param date Data em UTC
 * @param timeZone Fuso horário de destino
 * @returns Data no fuso horário especificado
 */
export function toZonedTime(
  date: Date | string | null | undefined,
  timeZone?: string
): Date | null {
  if (!date) return null;
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return null;
    
    // Use o fuso horário especificado ou o padrão
    const tz = timeZone || defaultTimeZone;
    
    return toZonedTime(parsedDate, tz);
  } catch (error) {
    console.error('Erro convertendo para time zone:', error);
    return null;
  }
}

/**
 * Converte uma data de um fuso horário específico para UTC
 * @param zonedDate Data no fuso horário especificado
 * @param timeZone Fuso horário de origem
 * @returns Data em UTC
 */
export function fromZonedTime(
  zonedDate: Date | string | null | undefined,
  timeZone?: string
): Date | null {
  if (!zonedDate) return null;
  
  try {
    const parsedDate = parseDate(zonedDate);
    if (!parsedDate) return null;
    
    // Use o fuso horário especificado ou o padrão
    const tz = timeZone || defaultTimeZone;
    
    return fromZonedTime(parsedDate, tz);
  } catch (error) {
    console.error('Erro convertendo de time zone:', error);
    return null;
  }
}

/**
 * Obtém o deslocamento do fuso horário em minutos
 * @param timeZone Fuso horário
 * @param date Data para calcular o deslocamento
 * @returns Deslocamento em minutos
 */
export function getTimezoneOffsetMinutes(
  timeZone: string,
  date?: Date
): number {
  try {
    const dateToUse = date || new Date();
    return getTimezoneOffset(timeZone, dateToUse) / 60000; // Convertendo de milissegundos para minutos
  } catch (error) {
    console.error('Erro obtendo offset do timezone:', error);
    return 0;
  }
}
