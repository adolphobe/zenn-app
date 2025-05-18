
/**
 * Utilitários de data para uso em toda a aplicação
 * Este arquivo exporta funções do dateService para uso em componentes
 * Sempre use estas funções ou dateService diretamente, evite manipulação direta de datas
 */

import { dateService, configureDateTime, setDefaultTimeZone, setDefaultLocale } from '@/services/dateService';
import { ptBR, enUS, es } from 'date-fns/locale';
import { DateComparisonResult, TimeZoneInfo } from '@/types/dates';

// Mapeamento de locales disponíveis
export const availableLocales = {
  'pt-BR': ptBR,
  'en': enUS,
  'es': es
};

// Re-exporta funções do dateService para uso direto
export const {
  parseDate,
  toISOString,
  formatForDisplay,
  formatForDateTimeInput,
  isTaskOverdue,
  addDaysToDate,
  isSameDate,
  getDaysDifference,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay,
  // Funções de timezone
  formatInTimeZone,
  toTimeZone,
  fromTimeZone,
  getTimeZoneOffset,
  // Novas funções da Fase 3
  formatRelative,
  compareDates,
  validateDate
} = dateService;

// Re-exporta funções de configuração
export { configureDateTime, setDefaultTimeZone, setDefaultLocale };

/**
 * Formata uma data para exibição amigável relativa
 * Ex: "Hoje", "Ontem", "Há 3 dias"
 */
export const getRelativeDateDisplay = (date: Date | string | null, useTimeZone: boolean = false): string => {
  if (!date) return '';
  
  const parsedDate = dateService.parseDate(date);
  if (!parsedDate) return '';
  
  // Converte para o timezone configurado se necessário
  const dateToUse = useTimeZone ? 
    dateService.toTimeZone(parsedDate) || parsedDate : 
    parsedDate;
  
  if (dateService.isToday(dateToUse)) {
    return 'Hoje';
  }
  
  if (dateService.isYesterday(dateToUse)) {
    return 'Ontem';
  }
  
  const daysDiff = dateService.getDaysDifference(new Date(), dateToUse);
  if (daysDiff !== null && daysDiff <= 7) {
    return `Há ${daysDiff} ${daysDiff === 1 ? 'dia' : 'dias'}`;
  }
  
  // Para datas mais antigas, use o formato padrão
  return dateService.formatForDisplay(dateToUse);
};

/**
 * Lista de fusos horários comuns no Brasil
 */
export const commonBrazilianTimezones: TimeZoneInfo[] = [
  { id: 'America/Sao_Paulo', name: 'Horário de Brasília', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Manaus', name: 'Horário de Manaus', abbreviation: 'AMT', offset: -240 },
  { id: 'America/Belem', name: 'Horário de Belém', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Fortaleza', name: 'Horário de Fortaleza', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Recife', name: 'Horário de Recife', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Noronha', name: 'Horário de Fernando de Noronha', abbreviation: 'FNT', offset: -120 },
  { id: 'America/Rio_Branco', name: 'Horário do Acre', abbreviation: 'ACT', offset: -300 }
];

/**
 * Lista de fusos horários comuns no mundo
 */
export const commonWorldTimezones: TimeZoneInfo[] = [
  ...commonBrazilianTimezones,
  { id: 'America/New_York', name: 'Eastern Time (US)', abbreviation: 'ET', offset: -300 },
  { id: 'America/Chicago', name: 'Central Time (US)', abbreviation: 'CT', offset: -360 },
  { id: 'America/Denver', name: 'Mountain Time (US)', abbreviation: 'MT', offset: -420 },
  { id: 'America/Los_Angeles', name: 'Pacific Time (US)', abbreviation: 'PT', offset: -480 },
  { id: 'Europe/London', name: 'London', abbreviation: 'GMT', offset: 0 },
  { id: 'Europe/Paris', name: 'Central European Time', abbreviation: 'CET', offset: 60 },
  { id: 'Asia/Tokyo', name: 'Japan Standard Time', abbreviation: 'JST', offset: 540 },
  { id: 'Australia/Sydney', name: 'Australian Eastern Time', abbreviation: 'AET', offset: 600 }
];

/**
 * Detecta automaticamente o fuso horário local do usuário
 * @returns O ID IANA do fuso horário local
 */
export const detectLocalTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Erro ao detectar fuso horário local:', error);
    return 'America/Sao_Paulo'; // Default para Brasil
  }
};

/**
 * Configura o fuso horário para o local do usuário
 * Esta função deve ser chamada na inicialização da aplicação
 */
export const setupUserTimeZone = (): void => {
  const localTimeZone = detectLocalTimeZone();
  setDefaultTimeZone(localTimeZone);
  
  console.log(`Fuso horário configurado para: ${localTimeZone}`);
};

/**
 * Detecta o locale do navegador do usuário
 * @returns O código do locale (ex: 'pt-BR')
 */
export const detectUserLocale = (): string => {
  try {
    const userLanguage = navigator.language;
    return userLanguage || 'pt-BR'; // Default para português do Brasil
  } catch (error) {
    console.error('Erro ao detectar locale do usuário:', error);
    return 'pt-BR';
  }
};

/**
 * Configura o locale baseado nas preferências do navegador
 * Esta função deve ser chamada na inicialização da aplicação
 */
export const setupUserLocale = (): void => {
  const userLocale = detectUserLocale();
  
  // Verifica se temos o locale disponível
  const locale = availableLocales[userLocale as keyof typeof availableLocales] || ptBR;
  
  // Define o locale no serviço de datas
  setDefaultLocale(locale);
  
  console.log(`Locale configurado para: ${userLocale}`);
};

/**
 * Compara duas datas e retorna um resultado detalhado
 */
export const compareDatesDetailed = (date1: Date | string | null, date2: Date | string | null): DateComparisonResult => {
  return dateService.compareDates(date1, date2);
};

/**
 * Inicializa as configurações de data e hora para toda a aplicação
 * Esta função deve ser chamada na inicialização da aplicação
 */
export const initializeDateTimeSettings = (): void => {
  setupUserTimeZone();
  setupUserLocale();
  
  console.log('Configurações de data e hora inicializadas com sucesso');
};
