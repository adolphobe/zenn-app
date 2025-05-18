
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
    let formattedDate: string;
    
    if (showRelative) {
      // Usa formato relativo (hoje, ontem, etc)
      formattedDate = formatRelative(date);
    } else {
      // Usa formato padrão com as opções fornecidas
      formattedDate = formatDate(date, {
        ...options,
        useTimeZone: showTimeZone
      });
    }
    
    // Se não conseguiu formatar, exibe o fallback
    if (!formattedDate) return <span className={className}>{fallback}</span>;
    
    return (
      <time 
        dateTime={dateService.toISOString(date) || ''} 
        className={className}
      >
        {formattedDate}
      </time>
    );
  } catch (error) {
    console.error('Erro ao renderizar data:', error);
    return <span className={className}>{fallback}</span>;
  }
};

export default DateTimeDisplay;
