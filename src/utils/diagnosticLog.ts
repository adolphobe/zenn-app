
/**
 * Enhanced diagnostic logging with better control mechanisms
 */

import { throttledLog, LogLevel, logDebug, disableCategory, enableCategory } from './logUtils';

// Global control flags for diagnostic logs
const ENABLE_DIAGNOSTIC_LOGS = process.env.NODE_ENV !== 'production';

// Cache of recent logs to prevent duplicates in short time spans
const recentLogs = new Map<string, number>();
const DEDUP_WINDOW = 2000; // 2 second window for deduplication

/**
 * High-level diagnostic logging with deduplication
 */
export const logDiagnostics = (category: string, message: string, data?: any) => {
  if (!ENABLE_DIAGNOSTIC_LOGS) return;
  
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  
  // Create a deduplication key based on category and message
  const dedupKey = `${category}:${message}`;
  const now = Date.now();
  const lastLogTime = recentLogs.get(dedupKey) || 0;
  
  // Check if this is a duplicate log within the window
  if (now - lastLogTime < DEDUP_WINDOW) {
    return false; // Skip duplicate logs
  }
  
  // Record this log in the recent logs cache
  recentLogs.set(dedupKey, now);
  
  // Limit the size of the cache to prevent memory leaks
  if (recentLogs.size > 100) {
    // Delete the oldest entries
    const keys = Array.from(recentLogs.keys());
    keys.slice(0, 20).forEach(key => recentLogs.delete(key));
  }
  
  // Use the throttled logging system
  return throttledLog(
    `DIAG:${category}`, 
    `[${timestamp}] ${message}`, 
    data, 
    LogLevel.DEBUG
  );
};

/**
 * Special log function for task state changes
 */
export const logTaskStateChange = (
  action: string, 
  taskId: string, 
  taskTitle: string, 
  beforeState?: any, 
  afterState?: any
) => {
  if (!ENABLE_DIAGNOSTIC_LOGS) return;
  
  // Only log diffs if both states exist
  let stateDiff = null;
  if (beforeState && afterState) {
    stateDiff = {};
    
    // Get keys from both states
    const allKeys = new Set([
      ...Object.keys(beforeState || {}),
      ...Object.keys(afterState || {})
    ]);
    
    // Check each key for differences
    allKeys.forEach(key => {
      if (beforeState[key] !== afterState[key]) {
        stateDiff[key] = {
          before: beforeState[key],
          after: afterState[key]
        };
      }
    });
    
    // If no differences found, don't log state diff
    if (Object.keys(stateDiff).length === 0) {
      stateDiff = null;
    }
  }
  
  throttledLog(
    'TASK_STATE', 
    `${action} - Task ${taskId.substring(0, 6)}... (${taskTitle})`,
    { 
      taskId,
      changes: stateDiff,
      timestamp: new Date().toISOString()
    },
    LogLevel.INFO
  );
};

/**
 * Enable/disable specific diagnostic log categories
 */
export const disableDateLogs = () => {
  disableCategory('DIAG:DATE');
};

export const enableDateLogs = () => {
  enableCategory('DIAG:DATE');
};

export const disableTaskStateLogs = () => {
  disableCategory('TASK_STATE');
};

export const enableTaskStateLogs = () => {
  enableCategory('TASK_STATE');
};
