
import { parseDate } from './dateParser';
import { formatToISOString } from './dateFormatter';

/**
 * Converte os campos de data de DTO para formato interno (Date)
 */
export function fromDTO(dto: any): Partial<any> {
  return {
    ...(dto.ideal_date !== undefined && { idealDate: parseDate(dto.ideal_date) }),
    ...(dto.created_at !== undefined && { createdAt: parseDate(dto.created_at) || new Date() }),
    ...(dto.completed_at !== undefined && { completedAt: parseDate(dto.completed_at) })
  };
}

/**
 * Converte os campos de data do formato interno (Date) para DTO
 */
export function toDTO(fields: any): Partial<any> {
  return {
    ...(fields.idealDate !== undefined && { ideal_date: formatToISOString(fields.idealDate) }),
    ...(fields.createdAt !== undefined && { created_at: formatToISOString(fields.createdAt) || new Date().toISOString() }),
    ...(fields.completedAt !== undefined && { completed_at: formatToISOString(fields.completedAt) })
  };
}
