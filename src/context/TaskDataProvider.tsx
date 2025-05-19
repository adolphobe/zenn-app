
import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useTaskData } from '@/hooks/useTaskData';
import { Task, TaskFormData } from '@/types';
import { dateService } from '@/services/dateService';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';
import { logWarn, logError } from '@/utils/logUtils';

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
  }, [processingErrors]);
  
  // Process completed tasks to ensure dates are valid Date objects
  const processedCompletedTasks = useMemo(() => {
    const tasks = completedTasksData.tasks || [];
    const errors: string[] = [];
    
    logDiagnostics('TaskDataProvider', `Processing ${tasks.length} completed tasks`);
    
    const processed = tasks.map(task => {
      try {
        // Log the original completedAt for diagnosis
        logDateInfo('TaskDataProvider', `Task ${task.id} original completedAt`, task.completedAt);
        
        // IMPROVED: Enhanced completed date handling with fallback
        let completedAt: Date | null = null;
        
        if (task.completedAt) {
          completedAt = dateService.parseDate(task.completedAt);
          
          if (completedAt) {
            logDiagnostics('TaskDataProvider', `Task ${task.id}: completedAt parsed successfully`);
          } else {
            // If we can't parse it, use current date as fallback
            completedAt = new Date();
            logDiagnostics('TaskDataProvider', `Task ${task.id}: FALLBACK to current date for invalid completedAt`, {
              original: task.completedAt
            });
          }
        } else if (task.completed) {
          // If task is completed but has no completedAt, provide a fallback
          completedAt = new Date();
          logDiagnostics('TaskDataProvider', `Task ${task.id}: FALLBACK to current date for missing completedAt`);
        }
        
        // Log the processed completedAt
        logDateInfo('TaskDataProvider', `Task ${task.id} processed completedAt`, completedAt);
        
        // Ensure we return a new object (immutability) with properly processed dates
        return {
          ...task,
          completedAt,
          // Ensure idealDate is validated but keep original type structure
          idealDate: task.idealDate ? dateService.parseDate(task.idealDate) : null,
          // Ensure createdAt is validated but keep original type structure
          createdAt: task.createdAt ? dateService.parseDate(task.createdAt) : new Date()
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
    }
    
    return processed;
  }, [completedTasksData.tasks]);

  // Create context value with both active and completed tasks
  const contextValue: TaskDataContextType = {
    ...activeTasksData,
    completedTasks: processedCompletedTasks,
    completedTasksLoading: completedTasksData.isLoading,
  };

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
