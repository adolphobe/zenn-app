
// Optimized logging system with improved throttling and control mechanisms
const logThrottles: Record<string, number> = {};
const LOG_INTERVAL = 3000; // 3 seconds between logs of the same type
const CATEGORY_BLOCKLIST: string[] = []; // Categories to completely skip
const MAX_LOGS_PER_CATEGORY = 50; // Maximum logs per category before throttling increases
const categoryLogCounts: Record<string, number> = {};

// Levels of log for better control
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

// Global configuration for logging
const LOG_CONFIG = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableThrottling: true,
  disabledCategories: [] as string[]
};

/**
 * Improved throttled logging function with better category management
 */
export const throttledLog = (category: string, message: string, data?: any, level: LogLevel = LogLevel.INFO) => {
  // Skip completely blocked categories
  if (CATEGORY_BLOCKLIST.includes(category)) {
    return false;
  }
  
  // Verify if the category is disabled
  if (LOG_CONFIG.disabledCategories.includes(category)) {
    return false;
  }
  
  // Check if the log level is sufficient
  if (level < LOG_CONFIG.minLevel) {
    return false;
  }
  
  // Track log counts and increase throttling for noisy categories
  categoryLogCounts[category] = (categoryLogCounts[category] || 0) + 1;
  
  // Dynamic throttling - increase throttle time for very active categories
  let effectiveInterval = LOG_INTERVAL;
  if (categoryLogCounts[category] > MAX_LOGS_PER_CATEGORY) {
    const multiplier = Math.floor(categoryLogCounts[category] / MAX_LOGS_PER_CATEGORY);
    effectiveInterval = LOG_INTERVAL * (1 + Math.min(5, multiplier)); // Cap at 6x normal interval
  }
  
  const now = Date.now();
  const lastLog = logThrottles[category] || 0;
  
  // If not using throttling or sufficient time has passed since the last log
  if (!LOG_CONFIG.enableThrottling || now - lastLog > effectiveInterval) {
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
 * Temporarily mutes logs for a category
 */
export const muteLogsFor = (category: string, durationMs: number = 30000) => {
  logThrottles[category] = Date.now() + durationMs;
  console.log(`[LOG] Logs da categoria "${category}" silenciados por ${durationMs/1000}s`);
};

/**
 * Completely disables logs for specific categories
 */
export const disableCategory = (category: string) => {
  if (!LOG_CONFIG.disabledCategories.includes(category)) {
    LOG_CONFIG.disabledCategories.push(category);
  }
};

/**
 * Permanently blocks a category from logging (stronger than disable)
 */
export const blockCategory = (category: string) => {
  if (!CATEGORY_BLOCKLIST.includes(category)) {
    CATEGORY_BLOCKLIST.push(category);
  }
};

/**
 * Enables logs for specific categories again
 */
export const enableCategory = (category: string) => {
  LOG_CONFIG.disabledCategories = LOG_CONFIG.disabledCategories.filter(c => c !== category);
  
  // Also remove from blocklist if present
  const blocklistIndex = CATEGORY_BLOCKLIST.indexOf(category);
  if (blocklistIndex >= 0) {
    CATEGORY_BLOCKLIST.splice(blocklistIndex, 1);
  }
};

/**
 * Configures the minimum log level
 */
export const setMinLogLevel = (level: LogLevel) => {
  LOG_CONFIG.minLevel = level;
};

/**
 * Resets log counts for a fresh start
 */
export const resetLogCounts = () => {
  for (const category in categoryLogCounts) {
    categoryLogCounts[category] = 0;
  }
};

/**
 * Helper functions for different log levels
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
