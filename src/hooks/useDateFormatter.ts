
import { useState, useCallback, useMemo } from 'react';
import { dateService } from '@/services/dateService';
import { DateDisplayOptions, AdvancedDateFormatOptions } from '@/types/dates';
import { useAppContext } from '@/context/AppContext';

/**
 * Hook para formatação de datas com suporte a opções avançadas
 * e sincronização com as preferências globais do usuário
 */
export function useDateFormatter() {
  const { state } = useAppContext();
  const [lastOptions, setLastOptions] = useState<Record<string, any>>({});
  
  // Formato de data global baseado nas preferências do usuário
  const globalOptions = useMemo(() => ({
    ...state.dateDisplayOptions
  }), [state.dateDisplayOptions]);
  
  /**
   * Formata uma data de acordo com as opções fornecidas
   * Combina as opções globais com as opções específicas
   */
  const formatDate = useCallback((
    date: Date | string | null,
    options?: DateDisplayOptions | AdvancedDateFormatOptions
  ) => {
    // Armazena as últimas opções usadas para referência
    if (options) {
      setLastOptions(options);
    }
    
    try {
      // Se a opção 'relative' estiver ativa, usa formatação relativa
      if (options && 'relative' in options && options.relative) {
        return dateService.formatRelative(date);
      }
      
      // Caso contrário, usa formatação padrão com as opções fornecidas
      return dateService.formatForDisplay(date, options);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  }, []);
  
  /**
   * Formata uma data para exibição relativa (hoje, ontem, etc)
   */
  const formatRelative = useCallback((date: Date | string | null) => {
    try {
      return dateService.formatRelative(date);
    } catch (error) {
      console.error('Erro ao formatar data relativa:', error);
      return '';
    }
  }, []);
  
  /**
   * Formata uma data para exibição em um timezone específico
   */
  const formatInTimeZone = useCallback((
    date: Date | string | null,
    format: string,
    timeZone?: string
  ) => {
    try {
      return dateService.formatInTimeZone(date, format, timeZone);
    } catch (error) {
      console.error('Erro ao formatar data no timezone:', error);
      return '';
    }
  }, []);
  
  return {
    formatDate,
    formatRelative,
    formatInTimeZone,
    globalOptions,
    lastOptions
  };
}
