
import { useState, useCallback, useMemo } from 'react';
import { dateService, configureDateTime } from '@/services/dateService';
import { DateDisplayOptions, DateFormatConfig } from '@/types/dates';
import { useAppContext } from '@/context/AppContext';
import { ptBR } from 'date-fns/locale';

/**
 * Hook para centralizar a configuração de datas na aplicação
 * Usa as preferências do usuário do contexto global
 * Configurado para usar o fuso horário do Brasil por padrão
 */
export function useDateConfig() {
  const { state } = useAppContext();
  const [lastOptions, setLastOptions] = useState<Record<string, any>>({});
  
  // Recuperar as opções do contexto global com valores padrão para o Brasil
  const globalOptions = useMemo<DateDisplayOptions>(() => {
    const defaultBrazilOptions: DateDisplayOptions = {
      dateFormat: 'dd/MM/yyyy',
      timeFormat: 'HH:mm',
      useTimeZone: true
    };
    
    // Combinar opções do estado com os padrões brasileiros
    return {
      ...defaultBrazilOptions,
      ...(state.dateDisplayOptions || {})
    };
  }, [state.dateDisplayOptions]);
  
  // Configurar o serviço de data baseado nas opções globais
  const configure = useCallback((options?: Partial<DateFormatConfig>) => {
    const config: Partial<DateFormatConfig> = {
      locale: ptBR, // Define o locale brasileiro por padrão
      timeZone: 'America/Sao_Paulo', // Define o fuso horário brasileiro por padrão
      ...(globalOptions.dateFormat && { dateFormat: globalOptions.dateFormat }),
      ...(globalOptions.timeFormat && { timeFormat: globalOptions.timeFormat }),
      ...(globalOptions.useTimeZone && { timeZone: 'America/Sao_Paulo' })
    };
    
    if (options) {
      Object.assign(config, options);
      setLastOptions(options);
    }
    
    configureDateTime(config);
    return config;
  }, [globalOptions]);
  
  return {
    configure,
    globalOptions,
    currentConfig: dateService.config,
    lastOptions
  };
}
