
import React, { useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { AppContextType } from './types';
import appReducer from './appReducer'; // Changed from { appReducer } to default import
import { initialState } from './initialState';
import { initializeDemoTasks } from './demo/demoTasksInit';
import * as taskActions from './tasks/taskActions';
import * as uiActions from './ui/uiActions';

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
    addTask: (task) => taskActions.addTask(dispatch, task),
    deleteTask: (id) => taskActions.deleteTask(dispatch, id),
    toggleTaskCompleted: (id) => taskActions.toggleTaskCompleted(dispatch, id),
    toggleTaskHidden: (id) => taskActions.toggleTaskHidden(dispatch, id),
    updateTask: (id, data) => taskActions.updateTask(dispatch, id, data),
    updateTaskTitle: (id, title) => taskActions.updateTaskTitle(dispatch, id, title),
    setTaskFeedback: (id, feedback) => taskActions.setTaskFeedback(dispatch, id, feedback),
    restoreTask: (id) => taskActions.restoreTask(dispatch, id),
    addComment: (taskId, text) => taskActions.addComment(dispatch, taskId, text),
    deleteComment: (taskId, commentId) => taskActions.deleteComment(dispatch, taskId, commentId),
    
    // UI actions
    setViewMode: (mode) => uiActions.setViewMode(dispatch, mode),
    toggleShowHiddenTasks: () => uiActions.toggleShowHiddenTasks(dispatch),
    toggleShowPillars: () => uiActions.toggleShowPillars(dispatch),
    toggleShowDates: () => uiActions.toggleShowDates(dispatch),
    toggleDarkMode: () => uiActions.toggleDarkMode(dispatch),
    toggleSidebar: () => uiActions.toggleSidebar(dispatch),
    updateDateDisplayOptions: (options) => uiActions.updateDateDisplayOptions(dispatch, options),
    setSortOptions: (options) => uiActions.setSortOptions(dispatch, options)
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
