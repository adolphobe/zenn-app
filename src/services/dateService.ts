import {
  parse,
  format,
  isValid,
  parseISO,
  formatISO,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  addDays,
  differenceInDays,
  isSameDay,
  isToday,
  isYesterday,
  formatRelative as fnsFormatRelative,
  formatDistance,
  Locale
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  formatInTimeZone, 
  toZonedTime, 
  fromZonedTime,
  getTimezoneOffset
} from 'date-fns-tz';
import { ISODateString, DateDisplayOptions, DateFormatConfig } from '@/types/dates';

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
  parseDate(date: Date | ISODateString | null | undefined): Date | null {
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
  },
  
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
  formatInTimeZone(
    date: Date | ISODateString | null | undefined,
    format: string,
    timeZone: string = this.config.timeZone
  ): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate || !isValid(parsedDate)) return '';
      
      return formatInTimeZone(parsedDate, timeZone, format, {
        locale: this.config.locale
      });
    } catch (error) {
      console.error('Erro formatando data no fuso horário:', error);
      return '';
    }
  },
  
  /**
   * Converte uma data para o fuso horário especificado
   * @param date Data a ser convertida
   * @param timeZone Fuso horário de destino (ex: 'America/Sao_Paulo')
   */
  toTimeZone(
    date: Date | ISODateString | null | undefined, 
    timeZone: string = this.config.timeZone
  ): Date | null {
    if (!date) return null;
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate || !isValid(parsedDate)) return null;
      
      return toZonedTime(parsedDate, timeZone);
    } catch (error) {
      console.error('Erro convertendo data para fuso horário:', error);
      return null;
    }
  },
  
  /**
   * Converte uma data de um fuso horário específico para UTC
   * @param date Data no fuso horário especificado
   * @param timeZone Fuso horário de origem (ex: 'America/Sao_Paulo')
   */
  fromTimeZone(
    date: Date | ISODateString | null | undefined,
    timeZone: string = this.config.timeZone
  ): Date | null {
    if (!date) return null;
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate || !isValid(parsedDate)) return null;
      
      return fromZonedTime(parsedDate, timeZone);
    } catch (error) {
      console.error('Erro convertendo data do fuso horário para UTC:', error);
      return null;
    }
  },
  
  /**
   * Retorna o deslocamento do fuso horário em minutos
   * @param timeZone Fuso horário (ex: 'America/Sao_Paulo')
   * @param date Data para calcular o deslocamento (relevante para DST)
   */
  getTimeZoneOffset(timeZone: string = this.config.timeZone, date: Date = new Date()): number {
    try {
      return getTimezoneOffset(timeZone, date);
    } catch (error) {
      console.error('Erro obtendo deslocamento do fuso horário:', error);
      return 0;
    }
  },
  
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
      const isBefore = isBefore(parsed1, parsed2);
      const isAfter = isAfter(parsed1, parsed2);
      
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
        isBefore,
        isAfter,
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
        if (minDate && isBefore(parsedDate, minDate)) {
          return { 
            isValid: false, 
            message: `Data não pode ser anterior a ${this.formatForDisplay(minDate)}`
          };
        }
      }
      
      // Verifica data máxima, se especificada
      if (options?.maxDate) {
        const maxDate = this.parseDate(options.maxDate);
        if (maxDate && isAfter(parsedDate, maxDate)) {
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
  isTaskOverdue(date: Date | string | null): boolean {
    if (!date) return false;
    
    try {
      const dateToCompare = this.parseDate(date);
      
      if (!dateToCompare || !isValid(dateToCompare)) {
        return false;
      }
      
      return isBefore(dateToCompare, new Date());
    } catch (error) {
      console.error('Erro ao verificar se tarefa está vencida:', error);
      return false;
    }
  },
  
  /**
   * Adiciona ou subtrai dias a uma data
   */
  addDaysToDate(date: Date | null | undefined, days: number): Date | null {
    if (!date) return null;
    const parsedDate = this.parseDate(date);
    if (!parsedDate) return null;
    
    return addDays(parsedDate, days);
  },
  
  /**
   * Verifica se duas datas são no mesmo dia (ignorando hora)
   */
  isSameDate(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
    if (!date1 || !date2) return false;
    
    const parsed1 = this.parseDate(date1);
    const parsed2 = this.parseDate(date2);
    
    if (!parsed1 || !parsed2) return false;
    
    return isSameDay(parsed1, parsed2);
  },
  
  /**
   * Obtém a diferença em dias entre duas datas
   */
  getDaysDifference(date1: Date | null | undefined, date2: Date | null | undefined): number | null {
    if (!date1 || !date2) return null;
    
    const parsed1 = this.parseDate(date1);
    const parsed2 = this.parseDate(date2);
    
    if (!parsed1 || !parsed2) return null;
    
    return differenceInDays(parsed1, parsed2);
  },
  
  /**
   * Verifica se a data é hoje
   */
  isToday(date: Date | null | undefined): boolean {
    if (!date) return false;
    const parsedDate = this.parseDate(date);
    if (!parsedDate) return false;
    
    return isToday(parsedDate);
  },
  
  /**
   * Verifica se a data é ontem
   */
  isYesterday(date: Date | null | undefined): boolean {
    if (!date) return false;
    const parsedDate = this.parseDate(date);
    if (!parsedDate) return false;
    
    return isYesterday(parsedDate);
  },
  
  /**
   * Retorna o início do dia (00:00:00)
   */
  startOfDay(date: Date | null | undefined): Date | null {
    if (!date) return null;
    const parsedDate = this.parseDate(date);
    if (!parsedDate) return null;
    
    return startOfDay(parsedDate);
  },
  
  /**
   * Retorna o fim do dia (23:59:59)
   */
  endOfDay(date: Date | null | undefined): Date | null {
    if (!date) return null;
    const parsedDate = this.parseDate(date);
    if (!parsedDate) return null;
    
    return endOfDay(parsedDate);
  }
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
export const setDefaultTimeZone = (timeZone: string) => {
  dateService.config.timeZone = timeZone;
};

/**
 * Define o locale padrão para toda a aplicação
 * @param locale Locale a ser usado (ex: ptBR)
 */
export const setDefaultLocale = (locale: Locale) => {
  dateService.config.locale = locale;
};
