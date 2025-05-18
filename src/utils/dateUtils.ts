
/**
 * Utilitários de data para uso em toda a aplicação
 * Este arquivo exporta funções do dateService para uso em componentes
 * Sempre use estas funções ou dateService diretamente, evite manipulação direta de datas
 */

import { dateService, configureDateTime, setDefaultTimeZone } from '@/services/dateService';

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
  // Novas funções de timezone
  formatInTimeZone,
  toTimeZone,
  fromTimeZone,
  getTimeZoneOffset
} = dateService;

// Re-exporta funções de configuração
export { configureDateTime, setDefaultTimeZone };

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
export const commonBrazilianTimezones = [
  { id: 'America/Sao_Paulo', name: 'Horário de Brasília', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Manaus', name: 'Horário de Manaus', abbreviation: 'AMT', offset: -240 },
  { id: 'America/Belem', name: 'Horário de Belém', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Fortaleza', name: 'Horário de Fortaleza', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Recife', name: 'Horário de Recife', abbreviation: 'BRT', offset: -180 },
  { id: 'America/Noronha', name: 'Horário de Fernando de Noronha', abbreviation: 'FNT', offset: -120 },
  { id: 'America/Rio_Branco', name: 'Horário do Acre', abbreviation: 'ACT', offset: -300 }
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
