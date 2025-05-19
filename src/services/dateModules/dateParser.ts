
import { parseISO, parse, isValid } from 'date-fns';
import { ISODateString } from '@/types/dates';
import { logError } from '@/utils/logUtils';

// Cache para datas já processadas - tamanho limitado para eficiência de memória
const MAX_CACHE_SIZE = 200;
const dateCache = new Map<string, Date | null>();

/**
 * Converte uma string ISO ou objeto Date para um objeto Date
 * Melhorada com tratamento de erro robusto e cache de resultados
 * @returns Date objeto ou null se inválido
 */
export function parseDate(date: Date | ISODateString | null | undefined): Date | null {
  // Fast path: se é null/undefined ou já um Date válido
  if (!date) return null;
  if (date instanceof Date) return isValid(date) ? date : null;
  
  // Caminho para strings com otimização de cache
  if (typeof date === 'string') {
    // Verifica o cache primeiro para datas frequentemente usadas
    if (dateCache.has(date)) {
      return dateCache.get(date) || null;
    }
    
    // Gerencia o tamanho do cache para evitar vazamentos de memória
    if (dateCache.size >= MAX_CACHE_SIZE) {
      // Limpa os 25% mais antigos de entradas quando o cache fica muito grande
      const keysToDelete = Array.from(dateCache.keys()).slice(0, MAX_CACHE_SIZE / 4);
      keysToDelete.forEach(key => dateCache.delete(key));
    }
    
    // Otimização: Tenta conversão direta primeiro para strings ISO (caso mais comum)
    try {
      if (date.includes('T') || date.includes('Z') || date.match(/^\d{4}-\d{2}-\d{2}/)) {
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
          dateCache.set(date, parsedDate);
          return parsedDate;
        }
      }
    } catch (err) {
      // Continua silenciosamente para o próximo formato
    }
    
    // Tenta formatos alternativos (DD/MM/YYYY)
    if (date.includes('/')) {
      try {
        const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          dateCache.set(date, parsedDate);
          return parsedDate;
        }
      } catch (err) {
        // Continua silenciosamente para o próximo formato
      }
    }
    
    // Tenta formato de timestamp numérico
    if (!isNaN(Number(date))) {
      try {
        const timestamp = Number(date);
        const parsedDate = new Date(timestamp);
        if (isValid(parsedDate)) {
          dateCache.set(date, parsedDate);
          return parsedDate;
        }
      } catch (err) {
        // Continua silenciosamente
      }
    }
    
    // Nenhum formato válido encontrado, cache resultado nulo
    dateCache.set(date, null);
  }
  
  // Se chegamos aqui, não conseguimos obter um Date válido
  return null;
}

/**
 * Limpa o cache de datas para evitar vazamentos de memória
 */
export function clearDateCache() {
  dateCache.clear();
}

/**
 * Verifica se uma data é válida com tratamento de erros melhorado
 */
export function isDateValid(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  
  try {
    if (date instanceof Date) {
      return isValid(date);
    }
    
    if (typeof date === 'string') {
      const parsed = parseDate(date);
      return parsed !== null;
    }
    
    return false;
  } catch (error) {
    logError('DateParser', 'Erro ao validar data:', error);
    return false;
  }
}

/**
 * Função auxiliar para sempre retornar uma data válida
 * Útil quando precisamos garantir que uma operação tenha uma data mesmo em caso de erro
 * @param fallback Valor padrão se a data for inválida
 */
export function parseDateWithFallback(date: Date | ISODateString | null | undefined, fallback: Date = new Date()): Date {
  const parsed = parseDate(date);
  return parsed || fallback;
}
