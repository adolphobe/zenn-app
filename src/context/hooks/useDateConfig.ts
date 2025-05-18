
import { useState, useCallback, useEffect } from 'react';
import { DateFormatConfig } from '@/types/dates';
import { dateService, configureDateTime, setDefaultTimeZone, setDefaultLocale } from '@/services/dateService';
import { ptBR } from 'date-fns/locale';
import { useAppContext } from '../AppContext';

/**
 * Hook para gerenciar a configuração global de datas na aplicação,
 * sincronizado com as preferências do usuário
 */
export function useDateConfig() {
  const { state } = useAppContext();
  const [currentConfig, setCurrentConfig] = useState<DateFormatConfig>(dateService.config);
  
  // Sincroniza com as preferências do usuário quando elas mudarem
  useEffect(() => {
    if (state.dateDisplayOptions) {
      updateDateConfig({
        // Adapta as preferências do usuário para o formato do DateFormatConfig
        dateFormat: state.dateDisplayOptions.dateFormat || 'dd/MM/yyyy',
        timeFormat: state.dateDisplayOptions.timeFormat || 'HH:mm',
      });
    }
  }, [state.dateDisplayOptions]);
  
  /**
   * Atualiza a configuração global de datas
   */
  const updateDateConfig = useCallback((newConfig: Partial<DateFormatConfig>) => {
    configureDateTime(newConfig);
    setCurrentConfig({...dateService.config});
  }, []);
  
  /**
   * Define o locale (idioma) para formatação de datas
   */
  const setLocale = useCallback((locale: any) => {
    setDefaultLocale(locale);
    setCurrentConfig({...dateService.config});
  }, []);
  
  /**
   * Define o fuso horário para formatação de datas
   */
  const setTimeZone = useCallback((timeZone: string) => {
    setDefaultTimeZone(timeZone);
    setCurrentConfig({...dateService.config});
  }, []);
  
  /**
   * Reseta a configuração para os valores padrão
   */
  const resetToDefaults = useCallback(() => {
    const defaults: DateFormatConfig = {
      locale: ptBR,
      dateFormat: 'dd/MM/yyyy',
      timeFormat: 'HH:mm',
      dateTimeFormat: 'dd/MM/yyyy HH:mm',
      hideSeconds: true,
      timeZone: 'America/Sao_Paulo'
    };
    
    configureDateTime(defaults);
    setCurrentConfig({...defaults});
  }, []);

  return {
    config: currentConfig,
    updateDateConfig,
    setLocale,
    setTimeZone,
    resetToDefaults,
  };
}
