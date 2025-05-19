
/**
 * Sistema de registro de logs específico para o sistema de comentários
 * Armazena logs no localStorage e permite exportá-los para um arquivo de texto
 */

// Níveis de log
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// Interface para um item de log
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

// Chave para armazenar logs no localStorage
const LOG_STORAGE_KEY = 'comment_system_logs';
// Número máximo de logs a manter
const MAX_LOGS = 1000;

/**
 * Recupera os logs armazenados
 */
export const getLogs = (): LogEntry[] => {
  try {
    const storedLogs = localStorage.getItem(LOG_STORAGE_KEY);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (e) {
    console.error('Erro ao ler logs do localStorage:', e);
    return [];
  }
};

/**
 * Salva os logs no localStorage
 */
const saveLogs = (logs: LogEntry[]): void => {
  try {
    // Limita o número de logs para evitar encher o localStorage
    const trimmedLogs = logs.slice(-MAX_LOGS);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (e) {
    console.error('Erro ao salvar logs no localStorage:', e);
  }
};

/**
 * Adiciona uma nova entrada de log
 */
const addLogEntry = (level: LogLevel, category: string, message: string, data?: any): void => {
  try {
    const newEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined
    };
    
    // Recupera logs existentes e adiciona o novo
    const logs = getLogs();
    logs.push(newEntry);
    saveLogs(logs);
    
    // Também mostra no console para facilitar depuração em tempo real
    const logFn = level === LogLevel.ERROR ? console.error : 
                 level === LogLevel.WARN ? console.warn : console.log;
    
    logFn(`[${level}][${category}] ${message}`, data);
  } catch (e) {
    console.error('Erro ao adicionar entrada de log:', e);
  }
};

/**
 * Limpa todos os logs armazenados
 */
export const clearLogs = (): void => {
  localStorage.removeItem(LOG_STORAGE_KEY);
};

/**
 * Exporta os logs para um arquivo de texto
 */
export const exportLogsToText = (): string => {
  const logs = getLogs();
  let content = 'LOGS DO SISTEMA DE COMENTÁRIOS\n';
  content += '===========================\n\n';
  
  logs.forEach(log => {
    content += `[${log.timestamp}] [${log.level}] [${log.category}] ${log.message}\n`;
    if (log.data) {
      content += JSON.stringify(log.data, null, 2) + '\n';
    }
    content += '\n';
  });
  
  return content;
};

/**
 * Funções de log para diferentes níveis
 */
export const logDebug = (category: string, message: string, data?: any): void => 
  addLogEntry(LogLevel.DEBUG, category, message, data);

export const logInfo = (category: string, message: string, data?: any): void =>
  addLogEntry(LogLevel.INFO, category, message, data);

export const logWarn = (category: string, message: string, data?: any): void =>
  addLogEntry(LogLevel.WARN, category, message, data);

export const logError = (category: string, message: string, data?: any): void =>
  addLogEntry(LogLevel.ERROR, category, message, data);

/**
 * Funções específicas para o sistema de comentários
 */
export const logComment = {
  // Ações de comentários
  attempt: (taskId: string, text: string, userId?: string) => 
    logInfo('COMMENT_ACTION', `Tentando adicionar comentário para tarefa ${taskId}`, { taskId, text, userId }),
  
  success: (taskId: string, commentId: string) =>
    logInfo('COMMENT_ACTION', `Comentário adicionado com sucesso (ID: ${commentId})`, { taskId, commentId }),
  
  error: (message: string, error: any) =>
    logError('COMMENT_ACTION', `Erro ao adicionar comentário: ${message}`, error),
  
  // Autenticação relacionada a comentários
  authCheck: (isAuthenticated: boolean, userId?: string) =>
    logInfo('COMMENT_AUTH', `Verificação de autenticação para comentário`, { isAuthenticated, userId }),
  
  authError: (message: string) =>
    logError('COMMENT_AUTH', `Erro de autenticação ao tentar comentar: ${message}`),
  
  // Validações
  validation: (message: string, data?: any) =>
    logWarn('COMMENT_VALIDATION', message, data),
  
  // API do Supabase
  api: {
    request: (action: string, params?: any) =>
      logDebug('COMMENT_API', `Solicitação à API Supabase: ${action}`, params),
    
    response: (action: string, data?: any) =>
      logDebug('COMMENT_API', `Resposta da API Supabase: ${action}`, data),
    
    error: (action: string, error: any) =>
      logError('COMMENT_API', `Erro na API Supabase durante ${action}`, error)
  },
  
  // Renderização de componentes
  render: (component: string, props?: any) =>
    logDebug('COMMENT_RENDER', `Renderizando componente ${component}`, props),
};
