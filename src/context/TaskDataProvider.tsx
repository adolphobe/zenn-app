import React, { createContext, useContext } from 'react';
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
  
  // Create context value with both active and completed tasks
  const contextValue: TaskDataContextType = {
    ...activeTasksData,
    completedTasks: completedTasksData.tasks.map(task => {
      // We're not changing the task type structure here, just ensuring dates are valid
      // This prevents "Invalid time value" errors when components try to format dates
      try {
        return {
          ...task,
          // Keep completedAt as string (matching Task interface) but validate it exists
          completedAt: task.completedAt || null,
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
        console.error('Error processing task date:', error, task);
        return task; // Return original task if processing fails
      }
    }),
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
