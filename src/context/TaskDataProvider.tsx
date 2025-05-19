import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useTaskData } from '@/hooks/useTaskData';
import { Task, TaskFormData } from '@/types';
import { dateService } from '@/services/dateService';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';
import { logWarn, logError, logInfo } from '@/utils/logUtils';

// Define the context type
type TaskDataContextType = ReturnType<typeof useTaskData> & {
  completedTasks: Task[];
  completedTasksLoading: boolean;
};

// Create the context
const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined);

// Provider component
export const TaskDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our hook to manage active tasks
  const activeTasksData = useTaskData(false);
  
  // Use a separate instance to manage completed tasks
  const completedTasksData = useTaskData(true);
  
  // Track and log task processing errors
  const [processingErrors, setProcessingErrors] = React.useState<string[]>([]);
  
  useEffect(() => {
    // Log processing errors only when we have some
    if (processingErrors.length > 0) {
      logError('TaskDataProvider', 'Erros ao processar tarefas concluídas:', 
        processingErrors.join(', ')
      );
    }

    // Log diagnostics about completed tasks
    logInfo('TaskDataProvider', `Status das tarefas: ${completedTasksData.tasks.length} tarefas concluídas carregadas`);
  }, [processingErrors, completedTasksData.tasks]);
  
  // Process completed tasks to ensure dates are valid Date objects
  const processedCompletedTasks = useMemo(() => {
    const tasks = completedTasksData.tasks || [];
    const errors: string[] = [];
    
    if (tasks.length === 0) {
      return [];
    }

    logDiagnostics('TaskDataProvider', `Processing ${tasks.length} completed tasks`);
    
    const processed = tasks.map(task => {
      try {
        // IMPROVED: Enhanced completed date handling with multiple fallbacks
        let completedAt: Date | null = null;
        
        if (task.completedAt) {
          // Try to parse the completedAt date
          completedAt = dateService.parseDate(task.completedAt);
          
          if (!completedAt) {
            // If parsing failed, log the error and use current date as fallback
            logWarn('TaskDataProvider', `Task ${task.id}: Invalid completedAt date, using current date as fallback`, {
              original: task.completedAt
            });
            completedAt = new Date();
          }
        } else if (task.completed) {
          // If task is completed but has no completedAt, provide a fallback
          logWarn('TaskDataProvider', `Task ${task.id}: Missing completedAt for completed task, using current date`);
          completedAt = new Date();
        }
        
        // Ensure createdAt is always valid
        const createdAt = task.createdAt ? dateService.parseDate(task.createdAt) : new Date();
        
        // Ensure idealDate is validated but keep original type structure
        const idealDate = task.idealDate ? dateService.parseDate(task.idealDate) : null;
        
        // Return a new object (immutability) with properly processed dates
        return {
          ...task,
          completedAt,
          idealDate,
          createdAt: createdAt || new Date()
        };
      } catch (error) {
        // Track specific error
        const errorMsg = `Error processing task ${task.id}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        logError('TaskDataProvider', errorMsg, task);
        
        // Always return a valid object even if processing fails
        return {
          ...task,
          completedAt: task.completed ? new Date() : null,
          idealDate: null,
          createdAt: new Date()
        };
      }
    });
    
    // Update error state
    if (errors.length > 0) {
      setProcessingErrors(errors);
    } else {
      // Clear previous errors if all went well
      setProcessingErrors([]);
    }
    
    return processed;
  }, [completedTasksData.tasks]);

  // Create context value with both active and completed tasks
  const contextValue: TaskDataContextType = {
    ...activeTasksData,
    completedTasks: processedCompletedTasks,
    completedTasksLoading: completedTasksData.isLoading,
  };

  // Log diagnostics about the context being provided
  useEffect(() => {
    logInfo('TaskDataProvider', `Providing ${processedCompletedTasks.length} completed tasks to context`);
  }, [processedCompletedTasks.length]);

  return (
    <TaskDataContext.Provider value={contextValue}>
      {children}
    </TaskDataContext.Provider>
  );
};

// Custom hook for using the context
export const useTaskDataContext = (): TaskDataContextType => {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error('useTaskDataContext must be used within a TaskDataProvider');
  }
  return context;
};
