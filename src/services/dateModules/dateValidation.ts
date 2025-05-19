
import { parseDate } from './dateParser';
import { isDateBefore, isDateAfter } from './dateOperations';
import { formatForDisplay } from './dateFormatter';

/**
 * Interface para resultado da validação de datas
 */
export interface DateValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Opções para validação de datas
 */
export interface DateValidationOptions {
  minDate?: Date | string;
  maxDate?: Date | string;
  businessDaysOnly?: boolean;
  allowNull?: boolean;
}

/**
 * Valida uma data contra restrições específicas
 */
export function validateDate(
  date: Date | string | null | undefined,
  options?: DateValidationOptions
): DateValidationResult {
  // Se a data for nula e isso for permitido, retorna válido
  if ((date === null || date === undefined) && options?.allowNull) {
    return { isValid: true, message: '' };
  }
  
  // Se a data for nula e não for permitido, retorna inválido
  if (date === null || date === undefined) {
    return { isValid: false, message: 'Data é obrigatória' };
  }
  
  try {
    const parsedDate = parseDate(date);
    
    // Verifica se a data é válida
    if (!parsedDate) {
      return { isValid: false, message: 'Data inválida' };
    }
    
    // Verifica data mínima, se especificada
    if (options?.minDate) {
      const minDate = parseDate(options.minDate);
      if (minDate && isDateBefore(parsedDate, minDate)) {
        // Formatação simples para a mensagem
        const formattedMinDate = formatForDisplay(minDate, {});
        return { 
          isValid: false, 
          message: `Data não pode ser anterior a ${formattedMinDate}`
        };
      }
    }
    
    // Verifica data máxima, se especificada
    if (options?.maxDate) {
      const maxDate = parseDate(options.maxDate);
      if (maxDate && isDateAfter(parsedDate, maxDate)) {
        // Formatação simples para a mensagem
        const formattedMaxDate = formatForDisplay(maxDate, {});
        return { 
          isValid: false, 
          message: `Data não pode ser posterior a ${formattedMaxDate}`
        };
      }
    }
    
    // Verificação de dias úteis pode ser implementada aqui se necessário
    
    // Se chegou até aqui, a data é válida
    return { isValid: true, message: '' };
  } catch (error) {
    console.error('Erro ao validar data:', error);
    return { isValid: false, message: 'Erro ao validar data' };
  }
}

/**
 * Formata uma data para exibição em mensagens de validação
 * Versão simplificada para evitar dependências circulares
 */
function formatForDisplay(date: Date, options: any): string {
  try {
    // Formato dd/MM/yyyy simples para mensagens de validação
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return date.toString();
  }
}
