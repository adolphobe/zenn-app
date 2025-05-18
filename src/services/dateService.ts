
import {
  parse,
  format,
  isValid,
  parseISO,
  formatISO,
  startOfDay,
  endOfDay,
  addDays,
  differenceInDays,
  isSameDay,
  isToday,
  isYesterday,
  formatRelative as fnsFormatRelative,
  formatDistance,
  Locale,
  isBefore as dateIsBefore,
  isAfter as dateIsAfter
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  formatInTimeZone, 
  toZonedTime, 
  fromZonedTime,
  getTimezoneOffset
} from 'date-fns-tz';
import { ISODateString, DateDisplayOptions, DateFormatConfig } from '@/types/dates';
import { parseDate } from './dateModules/dateParser';
import { 
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
} from './dateModules/dateOperations';
import { 
  formatInTimeZone as formatDateInTimeZone,
  toZonedTime as convertToZonedTime,
  fromZonedTime as convertFromZonedTime,
  getTimezoneOffset as getTimeZoneOffsetMinutes,
  getDefaultTimeZone,
  setDefaultTimeZone as setGlobalTimeZone
} from './dateModules/dateTimezone';

// Configuração padrão para formatação de datas
const DEFAULT_CONFIG: DateFormatConfig = {
  locale: ptBR,
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  hideSeconds: true,
  timeZone: 'America/Sao_Paulo' // Configuração padrão para Brasil
};

/**
 * Serviço centralizado para manipulação de datas e conversões
 */
export const dateService = {
  config: DEFAULT_CONFIG,

  /**
   * Converte uma string ISO ou objeto Date para um objeto Date
   * @returns Date objeto ou null se inválido
   */
  parseDate,
  
  /**
   * Converte uma data para string ISO para armazenamento ou API
   * @returns String ISO ou null
   */
  toISOString(date: Date | ISODateString | null | undefined): ISODateString | null {
    if (!date) return null;
    
    try {
      // Se já for string, verifica se está em formato ISO
      if (typeof date === 'string') {
        // Converte para Date e depois para ISO para validar
        const parsedDate = this.parseDate(date);
        return parsedDate ? formatISO(parsedDate) : null;
      }
      
      // Se for Date, converte para ISO
      return isValid(date) ? formatISO(date) : null;
    } catch (error) {
      console.error('Erro ao converter para ISO:', error);
      return null;
    }
  },
  
  /**
   * Formata uma data para exibição no input datetime-local
   */
  formatForDateTimeInput(date: Date | ISODateString | null | undefined): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      
      if (!parsedDate || !isValid(parsedDate)) return '';
      
      // Ajustar para o fuso horário local (para inputs datetime-local)
      const localDate = new Date(parsedDate.getTime() - (parsedDate.getTimezoneOffset() * 60000));
      return formatISO(localDate).slice(0, 16);
    } catch (error) {
      console.error('Erro formatando data para input:', error);
      return '';
    }
  },
  
  /**
   * Formata uma data para exibição na interface do usuário
   */
  formatForDisplay(
    date: Date | ISODateString | null | undefined, 
    options?: DateDisplayOptions
  ): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate || !isValid(parsedDate)) return '';
      
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
      
      return format(parsedDate, formatString, { locale: this.config.locale });
      
    } catch (error) {
      console.error('Erro formatando data para exibição:', error);
      return '';
    }
  },
  
  /**
   * Formata uma data para exibição relativa (hoje, ontem, etc)
   */
  formatRelative(date: Date | ISODateString | null | undefined): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate || !isValid(parsedDate)) return '';
      
      if (this.isToday(parsedDate)) {
        return 'Hoje';
      }
      
      if (this.isYesterday(parsedDate)) {
        return 'Ontem';
      }
      
      // Para datas mais antigas (até 30 dias), usar formato relativo
      const now = new Date();
      const daysDiff = this.getDaysDifference(now, parsedDate);
      
      if (daysDiff !== null && daysDiff <= 30) {
        // Usar formatDistance do date-fns para formato relativo
        return formatDistance(parsedDate, now, { 
          addSuffix: true,
          locale: this.config.locale
        });
      }
      
      // Para datas mais antigas, usar formato padrão
      return this.formatForDisplay(parsedDate);
    } catch (error) {
      console.error('Erro formatando data relativa:', error);
      return '';
    }
  },
  
  /**
   * Formata uma data em um fuso horário específico para exibição
   * @param date Data a ser formatada
   * @param format Formato de saída (ex: 'dd/MM/yyyy HH:mm')
   * @param timeZone Fuso horário (ex: 'America/Sao_Paulo')
   */
  formatInTimeZone: formatDateInTimeZone,
  
  /**
   * Converte uma data para o fuso horário especificado
   * @param date Data a ser convertida
   * @param timeZone Fuso horário de destino (ex: 'America/Sao_Paulo')
   */
  toTimeZone: convertToZonedTime,
  
  /**
   * Converte uma data de um fuso horário específico para UTC
   * @param date Data no fuso horário especificado
   * @param timeZone Fuso horário de origem (ex: 'America/Sao_Paulo')
   */
  fromTimeZone: convertFromZonedTime,
  
  /**
   * Retorna o deslocamento do fuso horário em minutos
   * @param timeZone Fuso horário (ex: 'America/Sao_Paulo')
   * @param date Data para calcular o deslocamento (relevante para DST)
   */
  getTimeZoneOffset: getTimeZoneOffsetMinutes,
  
  /**
   * Compara duas datas e retorna informações detalhadas sobre a comparação
   */
  compareDates(date1: Date | ISODateString | null | undefined, date2: Date | ISODateString | null | undefined) {
    if (!date1 || !date2) {
      return {
        isEqual: false,
        isBefore: false,
        isAfter: false,
        diffInDays: 0,
        diffInHours: 0,
        diffInMinutes: 0,
        diffInSeconds: 0,
        humanReadableDiff: ''
      };
    }
    
    try {
      const parsed1 = this.parseDate(date1);
      const parsed2 = this.parseDate(date2);
      
      if (!parsed1 || !parsed2) {
        return {
          isEqual: false,
          isBefore: false,
          isAfter: false,
          diffInDays: 0,
          diffInHours: 0,
          diffInMinutes: 0,
          diffInSeconds: 0,
          humanReadableDiff: ''
        };
      }
      
      const isEqual = isSameDay(parsed1, parsed2);
      const isBeforeResult = dateIsBefore(parsed1, parsed2);  // Usando a versão renomeada
      const isAfterResult = dateIsAfter(parsed1, parsed2);    // Usando a versão renomeada
      
      const diffInMillis = Math.abs(parsed2.getTime() - parsed1.getTime());
      const diffInSeconds = Math.floor(diffInMillis / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      
      const humanReadableDiff = formatDistance(parsed1, parsed2, {
        locale: this.config.locale
      });
      
      return {
        isEqual,
        isBefore: isBeforeResult,
        isAfter: isAfterResult,
        diffInDays,
        diffInHours,
        diffInMinutes,
        diffInSeconds,
        humanReadableDiff
      };
    } catch (error) {
      console.error('Erro ao comparar datas:', error);
      return {
        isEqual: false,
        isBefore: false,
        isAfter: false,
        diffInDays: 0,
        diffInHours: 0,
        diffInMinutes: 0,
        diffInSeconds: 0,
        humanReadableDiff: ''
      };
    }
  },
  
  /**
   * Valida uma data contra restrições específicas
   * @param date Data a ser validada
   * @param options Opções de validação
   * @returns Objeto com resultado da validação e mensagem de erro
   */
  validateDate(date: Date | string | null, options?: {
    minDate?: Date | string,
    maxDate?: Date | string,
    businessDaysOnly?: boolean,
    allowNull?: boolean
  }) {
    // Se a data for nula e isso for permitido, retorna válido
    if ((date === null || date === undefined) && options?.allowNull) {
      return { isValid: true, message: '' };
    }
    
    // Se a data for nula e não for permitido, retorna inválido
    if (date === null || date === undefined) {
      return { isValid: false, message: 'Data é obrigatória' };
    }
    
    try {
      const parsedDate = this.parseDate(date);
      
      // Verifica se a data é válida
      if (!parsedDate || !isValid(parsedDate)) {
        return { isValid: false, message: 'Data inválida' };
      }
      
      // Verifica data mínima, se especificada
      if (options?.minDate) {
        const minDate = this.parseDate(options.minDate);
        if (minDate && dateIsBefore(parsedDate, minDate)) {  // Usando a versão renomeada
          return { 
            isValid: false, 
            message: `Data não pode ser anterior a ${this.formatForDisplay(minDate)}`
          };
        }
      }
      
      // Verifica data máxima, se especificada
      if (options?.maxDate) {
        const maxDate = this.parseDate(options.maxDate);
        if (maxDate && dateIsAfter(parsedDate, maxDate)) {  // Usando a versão renomeada
          return { 
            isValid: false, 
            message: `Data não pode ser posterior a ${this.formatForDisplay(maxDate)}`
          };
        }
      }
      
      // Se chegou até aqui, a data é válida
      return { isValid: true, message: '' };
    } catch (error) {
      console.error('Erro ao validar data:', error);
      return { isValid: false, message: 'Erro ao validar data' };
    }
  },
  
  /**
   * Converte os campos de data de DTO para formato interno (Date)
   */
  fromDTO(dto: any): Partial<any> {
    return {
      ...(dto.ideal_date !== undefined && { idealDate: this.parseDate(dto.ideal_date) }),
      ...(dto.created_at !== undefined && { createdAt: this.parseDate(dto.created_at) || new Date() }),
      ...(dto.completed_at !== undefined && { completedAt: this.parseDate(dto.completed_at) })
    };
  },
  
  /**
   * Converte os campos de data do formato interno (Date) para DTO
   */
  toDTO(fields: any): Partial<any> {
    return {
      ...(fields.idealDate !== undefined && { ideal_date: this.toISOString(fields.idealDate) }),
      ...(fields.createdAt !== undefined && { created_at: this.toISOString(fields.createdAt) || new Date().toISOString() }),
      ...(fields.completedAt !== undefined && { completed_at: this.toISOString(fields.completedAt) })
    };
  },
  
  /**
   * Verifica se uma data é anterior à data atual
   */
  isTaskOverdue: checkTaskOverdue,
  
  /**
   * Adiciona ou subtrai dias a uma data
   */
  addDaysToDate,
  
  /**
   * Verifica se duas datas são no mesmo dia (ignorando hora)
   */
  isSameDate,
  
  /**
   * Obtém a diferença em dias entre duas datas
   */
  getDaysDifference,
  
  /**
   * Verifica se a data é hoje
   */
  isToday: isDateToday,
  
  /**
   * Verifica se a data é ontem
   */
  isYesterday: isDateYesterday,
  
  /**
   * Retorna o início do dia (00:00:00)
   */
  startOfDay: getStartOfDay,
  
  /**
   * Retorna o fim do dia (23:59:59)
   */
  endOfDay: getEndOfDay
};

/**
 * Exporta uma função helper para configurar o serviço de data
 */
export const configureDateTime = (config: Partial<DateFormatConfig>) => {
  dateService.config = { ...dateService.config, ...config };
};

/**
 * Define o fuso horário padrão para toda a aplicação
 * @param timeZone Fuso horário (ex: 'America/Sao_Paulo', 'Europe/London')
 */
export const setDefaultTimeZone = setGlobalTimeZone;

/**
 * Define o locale padrão para toda a aplicação
 * @param locale Locale a ser usado (ex: ptBR)
 */
export const setDefaultLocale = (locale: Locale) => {
  dateService.config.locale = locale;
};
