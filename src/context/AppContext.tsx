
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TaskFormData, ViewMode, DateDisplayOptions, SortDirection } from '../types';
import { AppContextType, AppState, Action } from './types';
import { appReducer } from './appReducer';
import { initialState } from './initialState';
import { v4 as uuidv4 } from 'uuid';
import { initializeDemoTasks } from './demo/demoTasksInit';
import * as taskActions from './tasks/taskActions';
import * as uiActions from './ui/uiActions';

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with sample tasks
  useEffect(() => {
    initializeDemoTasks(dispatch, state.tasks.length);
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Create context value object with all actions
  const contextValue: AppContextType = {
    state,
    dispatch,
    // Task actions
    addTask: (task: TaskFormData) => taskActions.addTask(dispatch, task),
    deleteTask: (id: string) => taskActions.deleteTask(dispatch, id),
    toggleTaskCompleted: (id: string) => taskActions.toggleTaskCompleted(dispatch, id),
    toggleTaskHidden: (id: string) => taskActions.toggleTaskHidden(dispatch, id),
    updateTask: (id: string, data: Partial<TaskFormData>) => 
      taskActions.updateTask(dispatch, id, data),
    updateTaskTitle: (id: string, title: string) => 
      taskActions.updateTaskTitle(dispatch, id, title),
    setTaskFeedback: (id: string, feedback: 'transformed' | 'relief' | 'obligation') => 
      taskActions.setTaskFeedback(dispatch, id, feedback),
    
    // UI actions
    setViewMode: (mode: ViewMode) => uiActions.setViewMode(dispatch, mode),
    toggleShowHiddenTasks: () => uiActions.toggleShowHiddenTasks(dispatch),
    toggleDarkMode: () => uiActions.toggleDarkMode(dispatch),
    toggleSidebar: () => uiActions.toggleSidebar(dispatch),
    updateDateDisplayOptions: (options: DateDisplayOptions) => 
      uiActions.updateDateDisplayOptions(dispatch, options),
    setSortOptions: (options: { sortDirection: SortDirection; noDateAtEnd?: boolean }) => 
      uiActions.setSortOptions(dispatch, options)
  };

  return (
    <AppContext.Provider value={contextValue}>
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
