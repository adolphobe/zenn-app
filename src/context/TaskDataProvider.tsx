import React, { createContext, useContext, useMemo } from 'react';
import { useTaskData } from '@/hooks/useTaskData';
import { Task, TaskFormData } from '@/types';
import { safeParseDate } from '@/utils';

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
    return completedTasksData.tasks.map(task => {
      try {
        // Ensure completedAt is always a valid Date
        let completedAt: Date | null = null;
        
        if (task.completedAt) {
          if (task.completedAt instanceof Date) {
            completedAt = task.completedAt;
          } else {
            const parsedDate = safeParseDate(task.completedAt);
            completedAt = parsedDate || new Date(); // Use current date as fallback
          }
        }
        
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
        return task; // Return original task if processing fails
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
