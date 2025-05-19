import React, { createContext, useContext, useEffect, useMemo } from 'react';
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
  
  // Debug logs
  useEffect(() => {
    console.log("TaskDataProvider: Tarefas ativas carregadas:", activeTasksData.tasks?.length || 0);
    console.log("TaskDataProvider: Tarefas completadas carregadas:", completedTasksData.tasks?.length || 0);
    
    if (completedTasksData.tasks && completedTasksData.tasks.length > 0) {
      console.log("TaskDataProvider: Amostra das tarefas completadas:", 
        completedTasksData.tasks.slice(0, 2).map(t => ({
          id: t.id,
          title: t.title,
          completedAt: t.completedAt,
          completed: t.completed
        }))
      );
    }
  }, [activeTasksData.tasks, completedTasksData.tasks]);
  
  // Process completed tasks to ensure dates are valid
  const processedCompletedTasks = React.useMemo(() => {
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
        console.error('Error processing task date:', error, task);
        return task; // Return original task if processing fails
      }
    });
  }, [completedTasksData.tasks]);
  
  // Log when processed tasks change
  useEffect(() => {
    console.log(`TaskDataProvider: Processed ${processedCompletedTasks.length} completed tasks`);
    
    if (processedCompletedTasks.length > 0) {
      const withValidDates = processedCompletedTasks.filter(t => 
        t.completedAt instanceof Date && !isNaN(t.completedAt.getTime())
      ).length;
      
      console.log(`TaskDataProvider: ${withValidDates} of ${processedCompletedTasks.length} have valid completedAt dates`);
    }
  }, [processedCompletedTasks]);

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
