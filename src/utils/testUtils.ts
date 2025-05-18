
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { dateService } from '@/services/dateService';

/**
 * Utilitários para testes e depuração de datas
 */

/**
 * Registra informações detalhadas sobre uma data no console para depuração
 */
export function debugDate(date: Date | string | null, label: string = 'Data') {
  if (!date) {
    console.log(`${label}: null ou undefined`);
    return;
  }
  
  try {
    const parsedDate = dateService.parseDate(date);
    
    if (!parsedDate) {
      console.log(`${label}: Inválida [${date}]`);
      return;
    }
    
    console.group(`${label} (${parsedDate.toString()})`);
    console.log(`ISO: ${parsedDate.toISOString()}`);
    console.log(`Local: ${parsedDate.toLocaleString()}`);
    console.log(`UTC: ${parsedDate.toUTCString()}`);
    console.log(`Timestamp: ${parsedDate.getTime()}`);
    console.log(`Dia da semana: ${format(parsedDate, 'EEEE', { locale: ptBR })}`);
    
    // Informações de timezone
    console.log(`Timezone offset: ${parsedDate.getTimezoneOffset() / -60}h`);
    console.log(`Formatted (ptBR): ${dateService.formatForDisplay(parsedDate)}`);
    
    // Verifica se está no horário de verão
    const jan = new Date(parsedDate.getFullYear(), 0, 1);
    const jul = new Date(parsedDate.getFullYear(), 6, 1);
    const isDST = parsedDate.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    console.log(`Horário de verão: ${isDST ? 'Sim' : 'Não'}`);
    
    console.groupEnd();
  } catch (error) {
    console.error(`Erro ao depurar data [${label}]:`, error);
  }
}

/**
 * Gera uma data de teste para um número específico de dias no futuro/passado
 */
export function createTestDate(daysFromToday: number = 0, withTime: boolean = true): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  
  if (!withTime) {
    // Remover componente de tempo (00:00:00)
    date.setHours(0, 0, 0, 0);
  }
  
  return date;
}

/**
 * Compara duas datas em console.table para fácil visualização
 */
export function compareDatesTable(date1: Date | string | null, date2: Date | string | null, label1: string = 'Data 1', label2: string = 'Data 2') {
  const parsed1 = dateService.parseDate(date1);
  const parsed2 = dateService.parseDate(date2);
  
  if (!parsed1 || !parsed2) {
    console.log('Uma ou ambas as datas são inválidas');
    return;
  }
  
  const comparison = {
    [label1]: parsed1.toLocaleString(),
    [label2]: parsed2.toLocaleString(),
    'Diferença (dias)': dateService.getDaysDifference(parsed1, parsed2),
    [`${label1} antes de ${label2}`]: dateService.compareDates(parsed1, parsed2).isBefore,
    [`${label1} depois de ${label2}`]: dateService.compareDates(parsed1, parsed2).isAfter,
    [`${label1} igual a ${label2}`]: dateService.compareDates(parsed1, parsed2).isEqual,
    'Diferença legível': dateService.compareDates(parsed1, parsed2).humanReadableDiff
  };
  
  console.table(comparison);
}
