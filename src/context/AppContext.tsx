
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_TASKS } from '../constants';
import { TaskFormData, ViewMode, DateDisplayOptions, SortDirection } from '../types';
import { AppContextType, AppState, Action } from './types';
import { appReducer } from './appReducer';
import { initialState } from './initialState';
import { toast } from '../components/ui/use-toast';

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with sample tasks
  useEffect(() => {
    if (state.tasks.length === 0) {
      SAMPLE_TASKS.forEach(task => {
        dispatch({
          type: 'ADD_TASK',
          payload: {
            title: task.title,
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore,
            idealDate: task.idealDate || undefined
          }
        });
      });
    }
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Actions
  const addTask = (task: TaskFormData) => {
    dispatch({ type: 'ADD_TASK', payload: task });
    toast({
      title: "Tarefa adicionada",
      description: `"${task.title}" foi adicionada com sucesso.`
    });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskCompleted = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
  };

  const toggleTaskHidden = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
  };

  const updateTask = (id: string, data: Partial<TaskFormData>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
  };

  const updateTaskTitle = (id: string, title: string) => {
    dispatch({ type: 'UPDATE_TASK_TITLE', payload: { id, title } });
  };

  const setViewMode = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const toggleShowHiddenTasks = () => {
    dispatch({ type: 'TOGGLE_SHOW_HIDDEN_TASKS' });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const updateDateDisplayOptions = (options: DateDisplayOptions) => {
    dispatch({ type: 'UPDATE_DATE_DISPLAY_OPTIONS', payload: options });
  };

  const setSortOptions = (options: { sortDirection: SortDirection; noDateAtEnd?: boolean }) => {
    dispatch({ type: 'SET_SORT_OPTIONS', payload: options });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addTask,
        deleteTask,
        toggleTaskCompleted,
        toggleTaskHidden,
        updateTask,
        updateTaskTitle,
        setViewMode,
        toggleShowHiddenTasks,
        toggleDarkMode,
        toggleSidebar,
        updateDateDisplayOptions,
        setSortOptions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
