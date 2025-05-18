
import { format, formatRelative, formatDistance, formatISO } from 'date-fns';
import { parseDate } from './dateParser';
import { DateDisplayOptions } from '@/types/dates';
import { formatInTimeZone } from 'date-fns-tz';

// Configuração padrão para formatação
let defaultLocale: any = null;
let defaultDateFormat = 'dd/MM/yyyy';
let defaultTimeFormat = 'HH:mm';
let defaultDateTimeFormat = 'dd/MM/yyyy HH:mm';

/**
 * Define o locale padrão para formatação
 */
export function setDefaultFormatLocale(locale: any): void {
  defaultLocale = locale;
}

/**
 * Define os formatos padrão para datas e horas
 */
export function setDefaultFormats(config: {
  dateFormat?: string;
  timeFormat?: string;
  dateTimeFormat?: string;
}): void {
  if (config.dateFormat) defaultDateFormat = config.dateFormat;
  if (config.timeFormat) defaultTimeFormat = config.timeFormat;
  if (config.dateTimeFormat) defaultDateTimeFormat = config.dateTimeFormat;
}

/**
 * Formata uma data para exibição na interface
 */
export function formatDisplayDate(
  date: Date | string | null | undefined,
  options?: DateDisplayOptions
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    const { hideYear = false, hideTime = false, hideDate = false } = options || {};
    
    if (hideDate) return '';
    
    let formatString = '';
    
    // Construir string de formato baseada nas opções
    if (!hideDate) {
      formatString = hideYear ? 'dd/MM' : defaultDateFormat;
    }
    
    if (!hideTime) {
      if (formatString) formatString += ' ';
      formatString += defaultTimeFormat;
    }
    
    return format(parsedDate, formatString, { 
      locale: defaultLocale 
    });
    
  } catch (error) {
    console.error('Erro formatando data para exibição:', error);
    return '';
  }
}

/**
 * Formata uma data para exibição relativa (hoje, ontem, etc)
 */
export function formatRelativeDate(
  date: Date | string | null | undefined,
  baseDate: Date = new Date()
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    return formatRelative(parsedDate, baseDate, {
      locale: defaultLocale
    });
  } catch (error) {
    console.error('Erro formatando data relativa:', error);
    return '';
  }
}

/**
 * Formata a distância entre duas datas em linguagem natural
 */
export function formatDateDistance(
  date: Date | string | null | undefined,
  baseDate: Date | string | null | undefined = new Date(),
  options?: { addSuffix?: boolean }
): string {
  if (!date || !baseDate) return '';
  
  try {
    const parsedDate = parseDate(date);
    const parsedBaseDate = parseDate(baseDate);
    
    if (!parsedDate || !parsedBaseDate) return '';
    
    return formatDistance(parsedDate, parsedBaseDate, {
      locale: defaultLocale,
      addSuffix: options?.addSuffix
    });
  } catch (error) {
    console.error('Erro formatando distância entre datas:', error);
    return '';
  }
}

/**
 * Formata uma data no formato ISO
 */
export function formatToISOString(
  date: Date | string | null | undefined
): string | null {
  if (!date) return null;
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return null;
    
    return formatISO(parsedDate);
  } catch (error) {
    console.error('Erro formatando data para ISO:', error);
    return null;
  }
}

/**
 * Formata uma data para exibição no input datetime-local
 */
export function formatForDateTimeInput(
  date: Date | string | null | undefined
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    // Ajustar para o fuso horário local (para inputs datetime-local)
    const localDate = new Date(
      parsedDate.getTime() - (parsedDate.getTimezoneOffset() * 60000)
    );
    
    return formatISO(localDate).slice(0, 16);
  } catch (error) {
    console.error('Erro formatando data para input:', error);
    return '';
  }
}

/**
 * Formata uma data em um formato específico e com um idioma específico
 */
export function formatWithOptions(
  date: Date | string | null | undefined,
  formatString: string,
  locale?: any
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    return format(parsedDate, formatString, {
      locale: locale || defaultLocale
    });
  } catch (error) {
    console.error('Erro formatando data com opções:', error);
    return '';
  }
}

/**
 * Formata uma data em um fuso horário específico
 */
export function formatDateInTimeZone(
  date: Date | string | null | undefined,
  formatStr: string,
  timeZone: string,
  options?: { locale?: any }
): string {
  if (!date) return '';
  
  try {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '';
    
    return formatInTimeZone(parsedDate, timeZone, formatStr, {
      locale: options?.locale || defaultLocale
    });
  } catch (error) {
    console.error('Erro formatando data no fuso horário:', error);
    return '';
  }
}
