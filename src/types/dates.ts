
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
  locale: string;
  dateFormat: string;
  timeFormat: string;
  dateTimeFormat: string;
  hideSeconds: boolean;
  timeZone: string; // Novo campo para timezone
}

// Opções para exibição de datas específicas em componentes
export interface DateDisplayOptions {
  hideYear?: boolean;
  hideTime?: boolean;
  hideDate?: boolean;
  useTimeZone?: boolean; // Indica se deve usar timezone na formatação
}

// Interface para informações de timezone
export interface TimeZoneInfo {
  id: string;         // Identificador IANA (ex: 'America/Sao_Paulo')
  name: string;       // Nome legível (ex: 'Horário de Brasília')
  abbreviation: string; // Abreviação (ex: 'BRT')
  offset: number;     // Deslocamento em minutos
}
