
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
