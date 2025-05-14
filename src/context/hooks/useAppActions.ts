
import { useAppContext } from '../AppContext';
import { TaskFormData, ViewMode, DateDisplayOptions, SortDirection } from '@/types';

/**
 * Custom hook providing access to all app actions
 */
export const useAppActions = () => {
  const { 
    addTask,
    deleteTask,
    toggleTaskCompleted,
    toggleTaskHidden,
    updateTask,
    updateTaskTitle,
    setTaskFeedback,
    setViewMode,
    toggleShowHiddenTasks,
    toggleDarkMode,
    toggleSidebar,
    updateDateDisplayOptions,
    setSortOptions,
    dispatch
  } = useAppContext();

  return {
    // Task actions
    taskActions: {
      addTask,
      deleteTask,
      toggleCompleted: toggleTaskCompleted,
      toggleHidden: toggleTaskHidden,
      update: updateTask,
      updateTitle: updateTaskTitle,
      setFeedback: setTaskFeedback,
      // New action for setting task pillar
      setPillar: (id: string, pillar: string) => {
        dispatch({ 
          type: 'UPDATE_TASK', 
          payload: { 
            id, 
            data: { pillar } as any // Type assertion to avoid TypeScript error
          } 
        });
      }
    },
    
    // UI actions
    uiActions: {
      setViewMode,
      toggleShowHiddenTasks,
      toggleDarkMode,
      toggleSidebar,
      updateDateDisplayOptions,
      setSortOptions,
    }
  };
};
