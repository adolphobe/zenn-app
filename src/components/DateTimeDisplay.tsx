
import React from 'react';
import { dateService } from '@/services/dateService';
import { DateDisplayOptions, AdvancedDateFormatOptions } from '@/types/dates';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { logDateInfo } from '@/utils/diagnosticLog';

interface DateTimeDisplayProps {
  date: Date | string | null;
  options?: DateDisplayOptions | AdvancedDateFormatOptions;
  className?: string;
  showRelative?: boolean;
  showTimeZone?: boolean;
  fallback?: string;
}

/**
 * Componente reutilizável para exibição formatada de datas e horas
 * Com melhor tratamento para datas inválidas
 */
const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  date,
  options,
  className = '',
  showRelative = false,
  showTimeZone = false,
  fallback = '-'
}) => {
  const { formatDate, formatRelative } = useDateFormatter();
  
  // Log para diagnóstico da data recebida
  React.useEffect(() => {
    logDateInfo('DateTimeDisplay', 'Recebido prop date', date);
  }, [date]);
  
  // Se não há data, exibe o fallback
  if (!date) {
    console.debug('DateTimeDisplay: Sem data, exibindo fallback', fallback);
    return <span className={`text-inherit ${className}`}>{fallback}</span>;
  }
  
  // Tenta formatar a data
  try {
    // Verifica se a data é válida antes de tentar formatar
    const validDate = dateService.parseDate(date);
    logDateInfo('DateTimeDisplay', 'Data após parseDate', validDate);
    
    if (!validDate) {
      console.debug('DateTimeDisplay: Data inválida após parseDate, exibindo fallback', { 
        date, 
        fallback 
      });
      return <span className={`text-inherit ${className}`}>{fallback}</span>;
    }
    
    let formattedDate: string;
    
    if (showRelative) {
      // Usa formato relativo (hoje, ontem, etc)
      formattedDate = formatRelative(validDate);
      logDateInfo('DateTimeDisplay', 'Data formatada como relativa', formattedDate);
    } else {
      // Usa formato padrão com as opções fornecidas
      formattedDate = formatDate(validDate, {
        ...options,
        useTimeZone: showTimeZone
      });
      logDateInfo('DateTimeDisplay', 'Data formatada padrão', formattedDate);
    }
    
    // Se não conseguiu formatar, exibe o fallback
    if (!formattedDate) {
      console.debug('DateTimeDisplay: Falha na formatação, exibindo fallback');
      return <span className={`text-inherit ${className}`}>{fallback}</span>;
    }
    
    // Garantir que temos um ISO string válido para o atributo dateTime
    const isoString = dateService.toISOString(validDate);
    if (!isoString) {
      console.debug('DateTimeDisplay: Falha ao gerar ISO string, usando span simples');
      return <span className={`text-inherit ${className}`}>{formattedDate}</span>;
    }
    
    return (
      <time 
        dateTime={isoString} 
        className={`text-inherit ${className}`}
      >
        {formattedDate}
      </time>
    );
  } catch (error) {
    console.error('Erro ao renderizar data:', error, { date });
    return <span className={`text-inherit ${className}`}>{fallback}</span>;
  }
};

export default DateTimeDisplay;
