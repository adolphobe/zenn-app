
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
    completedTasks: completedTasksData.tasks.map(task => ({
      ...task,
      idealDate: task.idealDate ? safeParseDate(task.idealDate) : null,
      createdAt: task.createdAt ? safeParseDate(task.createdAt) : new Date(),
      completedAt: task.completedAt ? safeParseDate(task.completedAt) : null
    })),
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
