
/**
 * Utility for diagnostic logging that can be easily enabled/disabled
 * and removed after validation of the task flow is complete
 */

// Global enable/disable flag for diagnostic logs
const ENABLE_DIAGNOSTIC_LOGS = true;

// Categorized logging for different components
export const logDiagnostics = (category: string, message: string, data?: any) => {
  if (!ENABLE_DIAGNOSTIC_LOGS) return;
  
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  
  if (data) {
    console.log(`[DIAG:${timestamp}][${category}] ${message}`, data);
  } else {
    console.log(`[DIAG:${timestamp}][${category}] ${message}`);
  }
};

// Special log function for task state changes
export const logTaskStateChange = (
  action: string, 
  taskId: string, 
  taskTitle: string, 
  beforeState?: any, 
  afterState?: any
) => {
  if (!ENABLE_DIAGNOSTIC_LOGS) return;
  
  logDiagnostics(
    'TASK_STATE', 
    `${action} - Task ${taskId.substring(0, 6)}... (${taskTitle})`,
    { 
      taskId,
      before: beforeState,
      after: afterState,
      timestamp: new Date().toISOString()
    }
  );
};

// Helper to log dates in consistent format
export const logDateInfo = (category: string, label: string, date: any) => {
  if (!ENABLE_DIAGNOSTIC_LOGS) return;
  
  let dateObj: Date | null = null;
  let dateStr = "Invalid Date";
  
  try {
    if (date instanceof Date) {
      dateObj = date;
      dateStr = date.toISOString();
    } else if (date) {
      dateObj = new Date(date);
      dateStr = dateObj.toISOString();
    }
  } catch (e) {
    dateStr = `Error parsing: ${date}`;
  }
  
  logDiagnostics(category, `${label}: ${dateStr}`, {
    original: date,
    parsed: dateObj,
    isValid: dateObj instanceof Date && !isNaN(dateObj.getTime())
  });
};
