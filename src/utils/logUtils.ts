
// Controle de logging para prevenir excesso de mensagens
const logThrottles: Record<string, number> = {};
const LOG_INTERVAL = 3000; // 3 segundos entre logs do mesmo tipo

/**
 * Função que limita a frequência de logs por categoria
 */
export const throttledLog = (category: string, message: string, data?: any) => {
  const now = Date.now();
  const lastLog = logThrottles[category] || 0;
  
  // Se passou tempo suficiente desde o último log desta categoria
  if (now - lastLog > LOG_INTERVAL) {
    if (data !== undefined) {
      console.log(`[${category}] ${message}`, data);
    } else {
      console.log(`[${category}] ${message}`);
    }
    logThrottles[category] = now;
    return true;
  }
  
  return false;
};

/**
 * Desativa temporariamente todos os logs de uma categoria
 */
export const muteLogsFor = (category: string, durationMs: number = 30000) => {
  logThrottles[category] = Date.now() + durationMs;
  console.log(`[LOG] Logs da categoria "${category}" silenciados por ${durationMs/1000}s`);
};
