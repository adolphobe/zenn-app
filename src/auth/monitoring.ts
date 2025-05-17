
/**
 * Sistema de monitoramento para debugging da autenticação
 * Sobrescreve os métodos do localStorage para capturar e registrar todas as operações
 */
export const setupStorageMonitor = () => {
  // Guarda as implementações originais
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;

  // Sobrescreve setItem para logar todas as alterações
  localStorage.setItem = function(key: string, value: string) {
    const stack = new Error().stack?.split('\n').slice(2, 5).join('\n') || 'No stack trace';
    console.log(`[MONITOR] localStorage.setItem('${key}', '${value.substring(0, 20)}${value.length > 20 ? '...' : ''}')`, stack);
    originalSetItem.apply(this, [key, value]);
  };
  
  // Sobrescreve removeItem para logar todas as remoções
  localStorage.removeItem = function(key: string) {
    const stack = new Error().stack?.split('\n').slice(2, 5).join('\n') || 'No stack trace';
    console.log(`[MONITOR] localStorage.removeItem('${key}')`, stack);
    originalRemoveItem.apply(this, [key]);
  };
  
  // Sobrescreve clear para logar limpezas
  localStorage.clear = function() {
    const stack = new Error().stack?.split('\n').slice(2, 5).join('\n') || 'No stack trace';
    console.log(`[MONITOR] localStorage.clear()`, stack);
    originalClear.apply(this);
  };
  
  console.log('[MONITOR] Sistema de monitoramento do localStorage ativado');
};

// Função para desativar o monitoramento se necessário
export const disableStorageMonitor = () => {
  // Esta implementação seria necessária para produção
  console.log('[MONITOR] Sistema de monitoramento desativado');
  // A implementação completa exigiria restaurar as funções originais do localStorage
};
