
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
    setSortOptions
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
