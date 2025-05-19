
import React, { createContext, useContext, useMemo } from 'react';
import { useTaskData } from '@/hooks/useTaskData';
import { Task, TaskFormData } from '@/types';
import { safeParseDate } from '@/utils';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';

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
  
  // Process completed tasks to ensure dates are valid
  const processedCompletedTasks = useMemo(() => {
    const tasks = completedTasksData.tasks || [];
    logDiagnostics('TaskDataProvider', `Processing ${tasks.length} completed tasks`);
    
    return tasks.map(task => {
      try {
        // Log the original completedAt for diagnosis
        logDateInfo('TaskDataProvider', `Task ${task.id} original completedAt`, task.completedAt);
        
        // IMPROVED: Enhanced completed date handling with fallback
        let completedAt: Date | null = null;
        
        if (task.completedAt) {
          if (task.completedAt instanceof Date) {
            completedAt = task.completedAt;
            logDiagnostics('TaskDataProvider', `Task ${task.id}: completedAt is already a Date instance`);
          } else {
            // Try harder to parse the date
            const parsedDate = safeParseDate(task.completedAt);
            
            if (parsedDate) {
              completedAt = parsedDate;
              logDiagnostics('TaskDataProvider', `Task ${task.id}: completedAt parsed successfully`);
            } else {
              // If we can't parse it, use current date as fallback
              completedAt = new Date();
              logDiagnostics('TaskDataProvider', `Task ${task.id}: FALLBACK to current date for invalid completedAt`);
            }
          }
        } else if (task.completed) {
          // If task is completed but has no completedAt, provide a fallback
          completedAt = new Date();
          logDiagnostics('TaskDataProvider', `Task ${task.id}: FALLBACK to current date for missing completedAt`);
        }
        
        // Log the processed completedAt
        logDateInfo('TaskDataProvider', `Task ${task.id} processed completedAt`, completedAt);
        
        return {
          ...task,
          completedAt,
          // Ensure idealDate is validated but keep original type structure
          idealDate: task.idealDate ? 
            (task.idealDate instanceof Date ? task.idealDate : safeParseDate(task.idealDate)) : 
            null,
          // Ensure createdAt is validated but keep original type structure
          createdAt: task.createdAt instanceof Date ? 
            task.createdAt : 
            (task.createdAt ? new Date(task.createdAt) : new Date())
        };
      } catch (error) {
        console.error('Error processing task date:', error);
        return {
          ...task,
          completedAt: task.completed ? new Date() : null
        }; // Return task with fixed completedAt if processing fails
      }
    });
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
