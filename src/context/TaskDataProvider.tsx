import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useTaskData } from '@/hooks/useTaskData';
import { Task, TaskFormData } from '@/types';
import { dateService } from '@/services/dateService';
import { logInfo } from '@/utils/logUtils';

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
  
  // Track processing errors
  const [processingErrors, setProcessingErrors] = React.useState<string[]>([]);
  
  // Log diagnostics about completed tasks - reduce frequency with deps array
  useEffect(() => {
    if (processingErrors.length > 0) {
      console.error('TaskDataProvider: Errors processing completed tasks:', processingErrors.join(', '));
    }

    // Simplified logging to reduce console noise
    if (completedTasksData.tasks.length > 0) {
      logInfo('TaskDataProvider', `${completedTasksData.tasks.length} tarefas concluídas carregadas`);
    }
  }, [processingErrors.length, completedTasksData.tasks.length]);
  
  // Process completed tasks to ensure dates are valid Date objects - OPTIMIZED
  const processedCompletedTasks = useMemo(() => {
    const tasks = completedTasksData.tasks || [];
    const errors: string[] = [];
    
    if (tasks.length === 0) {
      return [];
    }
    
    const processed = tasks.map(task => {
      try {
        // Only process dates if we need to
        let completedAt: Date | null = null;
        
        // Fast path: if it's already a valid Date, reuse it
        if (task.completedAt instanceof Date && !isNaN(task.completedAt.getTime())) {
          completedAt = task.completedAt;
        } 
        // Parse the date if it's not already a valid Date
        else if (task.completedAt) {
          completedAt = dateService.parseDate(task.completedAt) || new Date();
        } 
        // Default fallback for completed tasks without dates
        else if (task.completed) {
          completedAt = new Date();
        }
        
        // Optimize other date processing too
        const createdAt = task.createdAt instanceof Date ? 
          task.createdAt : 
          (task.createdAt ? dateService.parseDate(task.createdAt) : null) || 
          new Date();
        
        // Ensure idealDate is validated but keep original type structure - only process if needed
        const idealDate = !task.idealDate ? null :
          (task.idealDate instanceof Date ? task.idealDate : dateService.parseDate(task.idealDate));
        
        // Return a new object with properly processed dates
        return {
          ...task,
          completedAt,
          idealDate,
          createdAt
        };
      } catch (error) {
        // Track error but return valid object with fallback values
        errors.push(`Error processing task ${task.id}: ${error instanceof Error ? error.message : String(error)}`);
        
        return {
          ...task,
          completedAt: task.completed ? new Date() : null,
          idealDate: null,
          createdAt: new Date()
        };
      }
    });
    
    // Update error state only if there are errors - reduce renders
    if (errors.length > 0) {
      // Use setTimeout to avoid render loop from setState during render
      setTimeout(() => setProcessingErrors(errors), 0);
    } else if (processingErrors.length > 0) {
      // Only clear if needed
      setTimeout(() => setProcessingErrors([]), 0);
    }
    
    return processed;
  }, [completedTasksData.tasks, processingErrors.length]);

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
