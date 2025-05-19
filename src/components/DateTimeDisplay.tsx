
import React, { useMemo } from 'react';
import { dateService } from '@/services/dateService';
import { DateDisplayOptions, AdvancedDateFormatOptions } from '@/types/dates';
import { useDateFormatter } from '@/hooks/useDateFormatter';

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
 * Otimizado para evitar re-renderizações desnecessárias e logs excessivos
 */
const DateTimeDisplay: React.FC<DateTimeDisplayProps> = React.memo(({
  date,
  options,
  className = '',
  showRelative = false,
  showTimeZone = false,
  fallback = '-'
}) => {
  const { formatDate, formatRelative } = useDateFormatter();
  
  // Processamento e formatação da data - apenas uma vez para cada conjunto de props
  const { formattedDate, isoString } = useMemo(() => {
    // Se não há data, retorna valores vazios
    if (!date) {
      return { formattedDate: fallback, isoString: null };
    }
    
    try {
      // Verifica se a data é válida antes de tentar formatar
      const validDate = dateService.parseDate(date);
      if (!validDate) {
        return { formattedDate: fallback, isoString: null };
      }
      
      // Formata a data de acordo com as opções
      const displayText = showRelative 
        ? formatRelative(validDate)
        : formatDate(validDate, { ...options, useTimeZone: showTimeZone });
      
      // Gera ISO string para o atributo dateTime
      const iso = dateService.toISOString(validDate);
      
      return { 
        formattedDate: displayText || fallback, 
        isoString: iso 
      };
    } catch (error) {
      // Em caso de erro, usa o fallback
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao renderizar data:', error);
      }
      return { formattedDate: fallback, isoString: null };
    }
  }, [date, options, showRelative, showTimeZone, fallback, formatDate, formatRelative]);

  // Renderiza um time tag se tiver um ISO string válido, caso contrário um span simples
  if (isoString) {
    return (
      <time 
        dateTime={isoString} 
        className={className}
      >
        {formattedDate}
      </time>
    );
  }
  
  return <span className={className}>{formattedDate}</span>;
});

// Definição explícita de displayName para ferramentas de desenvolvimento
DateTimeDisplay.displayName = 'DateTimeDisplay';

export default DateTimeDisplay;
