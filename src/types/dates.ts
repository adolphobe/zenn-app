
/**
 * Definição de tipos específicos para manipulação de datas no aplicativo
 */

// Representa uma string ISO de data, garantindo consistência na serialização
export type ISODateString = string;

// Interface base para campos de data em modelos internos
export interface DateFields {
  idealDate: Date | null;
  createdAt: Date;
  completedAt: Date | null;
}

// Interface para campos de data em DTOs (objetos de transferência de dados)
// Usado para comunicação com APIs e armazenamento
export interface DateFieldsDTO {
  ideal_date: ISODateString | null;
  created_at: ISODateString;
  completed_at: ISODateString | null;
}

// Configuração global para exibição de datas na interface
export interface DateFormatConfig {
  locale: any; // Alterado de string para any para aceitar objetos Locale do date-fns
  dateFormat: string;
  timeFormat: string;
  dateTimeFormat: string;
  hideSeconds: boolean;
  timeZone: string;
}

// Opções para exibição de datas específicas em componentes
export interface DateDisplayOptions {
  hideYear?: boolean;
  hideTime?: boolean;
  hideDate?: boolean;
  useTimeZone?: boolean; // Indica se deve usar timezone na formatação
  dateFormat?: string; // Campo adicionado
  timeFormat?: string; // Campo adicionado
  format?: string; // Campo adicionado para compatibilidade
}

// Interface para informações de timezone
export interface TimeZoneInfo {
  id: string;         // Identificador IANA (ex: 'America/Sao_Paulo')
  name: string;       // Nome legível (ex: 'Horário de Brasília')
  abbreviation: string; // Abreviação (ex: 'BRT')
  offset: number;     // Deslocamento em minutos
}

// Novas interfaces para a Fase 3

// Interface para preferências de data do usuário
export interface UserDatePreferences {
  timeZone: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number; // 0 = domingo, 1 = segunda, etc.
  use24HourFormat: boolean;
}

// Interface para opções avançadas de formatação de datas
export interface AdvancedDateFormatOptions extends DateDisplayOptions {
  format?: string; // Formato personalizado (sobrescreve dateFormat/timeFormat)
  relative?: boolean; // Usar formato relativo (hoje, ontem, há 3 dias)
  includeTime?: boolean; // Incluir hora na formatação
  longFormat?: boolean; // Usar formato longo (ex: "5 de Janeiro de 2023" vs "05/01/2023")
  timeZone?: string; // Sobrescreve o timezone global para esta formatação específica
}

// Interface para resultado de comparação de datas
export interface DateComparisonResult {
  isEqual: boolean;
  isBefore: boolean;
  isAfter: boolean;
  diffInDays: number;
  diffInHours: number;
  diffInMinutes: number;
  diffInSeconds: number;
  humanReadableDiff: string; // Diferença em formato legível (ex: "3 dias atrás")
}
