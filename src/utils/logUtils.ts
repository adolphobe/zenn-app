
// Controle de logging para prevenir excesso de mensagens
const logThrottles: Record<string, number> = {};
const LOG_INTERVAL = 3000; // 3 segundos entre logs do mesmo tipo

// Níveis de log para melhor controle
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

// Configuração global de logging
const LOG_CONFIG = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableThrottling: true,
  disabledCategories: [] as string[]
};

/**
 * Função que limita a frequência de logs por categoria
 * Só exibe logs quando realmente necessário
 */
export const throttledLog = (category: string, message: string, data?: any, level: LogLevel = LogLevel.INFO) => {
  // Verificar se a categoria está desativada
  if (LOG_CONFIG.disabledCategories.includes(category)) {
    return false;
  }
  
  // Verificar se o nível de log é suficiente
  if (level < LOG_CONFIG.minLevel) {
    return false;
  }
  
  const now = Date.now();
  const lastLog = logThrottles[category] || 0;
  
  // Se não estiver usando throttling ou passou tempo suficiente desde o último log desta categoria
  if (!LOG_CONFIG.enableThrottling || now - lastLog > LOG_INTERVAL) {
    const levelPrefix = LogLevel[level] || 'INFO';
    if (data !== undefined) {
      console.log(`[${levelPrefix}][${category}] ${message}`, data);
    } else {
      console.log(`[${levelPrefix}][${category}] ${message}`);
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

/**
 * Desativa completamente logs de categorias específicas
 */
export const disableCategory = (category: string) => {
  if (!LOG_CONFIG.disabledCategories.includes(category)) {
    LOG_CONFIG.disabledCategories.push(category);
  }
};

/**
 * Habilita novamente logs de categorias específicas
 */
export const enableCategory = (category: string) => {
  LOG_CONFIG.disabledCategories = LOG_CONFIG.disabledCategories.filter(c => c !== category);
};

/**
 * Configura o nível mínimo de log
 */
export const setMinLogLevel = (level: LogLevel) => {
  LOG_CONFIG.minLevel = level;
};

/**
 * Logs helpers para diferentes níveis
 */
export const logDebug = (category: string, message: string, data?: any) => 
  throttledLog(category, message, data, LogLevel.DEBUG);

export const logInfo = (category: string, message: string, data?: any) => 
  throttledLog(category, message, data, LogLevel.INFO);

export const logWarn = (category: string, message: string, data?: any) => 
  throttledLog(category, message, data, LogLevel.WARN);

export const logError = (category: string, message: string, data?: any) => 
  throttledLog(category, message, data, LogLevel.ERROR);

export const logCritical = (category: string, message: string, data?: any) => 
  throttledLog(category, message, data, LogLevel.CRITICAL);
