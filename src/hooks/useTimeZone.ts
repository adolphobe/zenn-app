
import { useState, useCallback, useEffect } from 'react';
import { commonBrazilianTimezones, detectLocalTimeZone } from '@/utils/dateUtils';
import { TimeZoneInfo } from '@/types/dates';
import { dateService } from '@/services/dateService';
import { setDefaultTimeZone } from '@/services/dateService';

/**
 * Hook para gerenciamento de timezone na aplicação
 */
export function useTimeZone() {
  const [currentTimeZone, setCurrentTimeZone] = useState<string>(dateService.config.timeZone);
  const [availableTimeZones, setAvailableTimeZones] = useState<TimeZoneInfo[]>(commonBrazilianTimezones);
  
  // Detecta o timezone local do usuário
  useEffect(() => {
    const localTimeZone = detectLocalTimeZone();
    if (localTimeZone !== currentTimeZone) {
      setCurrentTimeZone(localTimeZone);
    }
  }, [currentTimeZone]);
  
  // Atualiza o timezone global quando o timezone atual é alterado
  useEffect(() => {
    setDefaultTimeZone(currentTimeZone);
  }, [currentTimeZone]);
  
  /**
   * Altera o timezone atual
   */
  const changeTimeZone = useCallback((newTimeZone: string) => {
    setCurrentTimeZone(newTimeZone);
    setDefaultTimeZone(newTimeZone);
  }, []);
  
  /**
   * Converte uma data para o timezone atual
   */
  const convertToCurrentTimeZone = useCallback((date: Date | string | null) => {
    return dateService.toTimeZone(date, currentTimeZone);
  }, [currentTimeZone]);
  
  /**
   * Formata uma data no timezone atual
   */
  const formatInCurrentTimeZone = useCallback((
    date: Date | string | null,
    format: string
  ) => {
    return dateService.formatInTimeZone(date, format, currentTimeZone);
  }, [currentTimeZone]);
  
  /**
   * Retorna o offset atual do timezone em minutos
   */
  const getCurrentOffset = useCallback(() => {
    return dateService.getTimeZoneOffset(currentTimeZone);
  }, [currentTimeZone]);
  
  return {
    currentTimeZone,
    availableTimeZones,
    changeTimeZone,
    convertToCurrentTimeZone,
    formatInCurrentTimeZone,
    getCurrentOffset
  };
}
