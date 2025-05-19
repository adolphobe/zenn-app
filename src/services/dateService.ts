// Importações existentes permanecem as mesmas
import { Locale } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ISODateString, DateDisplayOptions, DateFormatConfig } from '@/types/dates';

// Import all from date modules index
import {
  parseDate,
  formatDisplayDate, 
  formatRelativeDate, 
  formatDateDistance,
  formatToISOString,
  formatForDateTimeInput,
  formatWithOptions,
  setDefaultFormatLocale,
  setDefaultFormats,
  formatInTimeZone,
  toZonedTime,
  fromZonedTime,
  getTimezoneOffsetMinutes,
  getDefaultTimeZone,
  setDefaultTimeZone as setGlobalTimeZone,
  addDaysToDate, 
  getDaysDifference, 
  isSameDate, 
  isToday as isDateToday,
  isYesterday as isDateYesterday,
  startOfDay as getStartOfDay,
  endOfDay as getEndOfDay,
  isDateBefore,
  isDateAfter,
  isTaskOverdue as checkTaskOverdue
} from './dateModules';

// Import from new specialized modules
import { compareDates } from './dateModules/dateCompare';
import { validateDate } from './dateModules/dateValidation';
import { fromDTO, toDTO } from './dateModules/dateDTOConverter';

// Configuração padrão para formatação de datas - Brasileira
const DEFAULT_CONFIG: DateFormatConfig = {
  locale: ptBR,
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  hideSeconds: true,
  timeZone: 'America/Sao_Paulo' // Configuração padrão para Brasil
};

// Inicialização do sistema de datas com configuração brasileira
setDefaultFormatLocale(ptBR);
setGlobalTimeZone('America/Sao_Paulo');
setDefaultFormats({
  dateFormat: DEFAULT_CONFIG.dateFormat,
  timeFormat: DEFAULT_CONFIG.timeFormat,
  dateTimeFormat: DEFAULT_CONFIG.dateTimeFormat
});

/**
 * Serviço centralizado para manipulação de datas e conversões
 */
export const dateService = {
  config: DEFAULT_CONFIG,

  // Parser
  parseDate,
  
  // Formatting
  toISOString(date: Date | ISODateString | null | undefined): ISODateString | null {
    return formatToISOString(date);
  },
  
  formatForDateTimeInput,
  
  formatForDisplay(
    date: Date | ISODateString | null | undefined, 
    options?: DateDisplayOptions
  ): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate) return '';
      
      const { hideYear = false, hideTime = false, hideDate = false } = options || {};
      
      if (hideDate) return '';
      
      let formatString = '';
      
      // Construir string de formato baseada nas opções
      if (!hideDate) {
        formatString = hideYear ? 'dd/MM' : this.config.dateFormat;
      }
      
      if (!hideTime) {
        if (formatString) formatString += ' ';
        formatString += this.config.timeFormat;
      }
      
      return formatWithOptions(parsedDate, formatString, this.config.locale);
      
    } catch (error) {
      console.error('Erro formatando data para exibição:', error);
      return '';
    }
  },
  
  formatRelative(date: Date | ISODateString | null | undefined): string {
    return formatRelativeDate(date);
  },
  
  // Timezone
  formatInTimeZone,
  toTimeZone: toZonedTime,
  fromTimeZone: fromZonedTime,
  getTimeZoneOffset: getTimezoneOffsetMinutes,
  
  // Comparison
  compareDates,
  
  // Validation
  validateDate,
  
  // DTO conversion
  fromDTO,
  toDTO,
  
  // Common operations
  isTaskOverdue: checkTaskOverdue,
  addDaysToDate,
  isSameDate,
  getDaysDifference,
  isToday: isDateToday,
  isYesterday: isDateYesterday,
  startOfDay: getStartOfDay,
  endOfDay: getEndOfDay
};

/**
 * Exporta uma função helper para configurar o serviço de data
 */
export const configureDateTime = (config: Partial<DateFormatConfig>) => {
  // Atualiza a configuração do serviço de data
  dateService.config = { ...dateService.config, ...config };
  
  // Atualiza a configuração do formatador
  if (config.locale) {
    setDefaultFormatLocale(config.locale);
  }
  
  if (config.dateFormat || config.timeFormat || config.dateTimeFormat) {
    setDefaultFormats({
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
      dateTimeFormat: config.dateTimeFormat
    });
  }
  
  if (config.timeZone) {
    setGlobalTimeZone(config.timeZone);
  }
};

/**
 * Define o fuso horário padrão para toda a aplicação
 */
export const setDefaultTimeZone = setGlobalTimeZone;

/**
 * Define o locale padrão para toda a aplicação
 */
export const setDefaultLocale = (locale: Locale) => {
  dateService.config.locale = locale;
  setDefaultFormatLocale(locale);
};
