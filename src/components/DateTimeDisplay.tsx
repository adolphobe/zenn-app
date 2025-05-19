
import React from 'react';
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
  
  // Se não há data, exibe o fallback
  if (!date) return <span className={className}>{fallback}</span>;
  
  // Tenta formatar a data
  try {
    // Verifica se a data é válida antes de tentar formatar
    const validDate = dateService.parseDate(date);
    if (!validDate) return <span className={className}>{fallback}</span>;
    
    let formattedDate: string;
    
    if (showRelative) {
      // Usa formato relativo (hoje, ontem, etc)
      formattedDate = formatRelative(validDate);
    } else {
      // Usa formato padrão com as opções fornecidas
      formattedDate = formatDate(validDate, {
        ...options,
        useTimeZone: showTimeZone
      });
    }
    
    // Se não conseguiu formatar, exibe o fallback
    if (!formattedDate) return <span className={className}>{fallback}</span>;
    
    return (
      <time 
        dateTime={dateService.toISOString(validDate) || ''} 
        className={className}
      >
        {formattedDate}
      </time>
    );
  } catch (error) {
    console.error('Erro ao renderizar data:', error, { date });
    return <span className={className}>{fallback}</span>;
  }
};

export default DateTimeDisplay;

