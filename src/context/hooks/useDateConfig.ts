
import { useState, useCallback, useMemo } from 'react';
import { dateService, configureDateTime } from '@/services/dateService';
import { DateDisplayOptions, DateFormatConfig } from '@/types/dates';
import { useAppContext } from '@/context/AppContext';

/**
 * Hook para centralizar a configuração de datas na aplicação
 * Usa as preferências do usuário do contexto global
 */
export function useDateConfig() {
  const { state } = useAppContext();
  const [lastOptions, setLastOptions] = useState<Record<string, any>>({});
  
  // Recuperar as opções do contexto global
  const globalOptions = useMemo(() => state.dateDisplayOptions || {}, [state.dateDisplayOptions]);
  
  // Configurar o serviço de data baseado nas opções globais
  const configure = useCallback((options?: Partial<DateFormatConfig>) => {
    const config: Partial<DateFormatConfig> = {
      ...(globalOptions.dateFormat && { dateFormat: globalOptions.dateFormat as string }),
      ...(globalOptions.timeFormat && { timeFormat: globalOptions.timeFormat as string }),
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
