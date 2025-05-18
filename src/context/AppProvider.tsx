
import React, { useReducer, useEffect, useCallback } from 'react';
import { AppContext } from './AppContext';
import { AppContextType } from './types';
import { appReducer } from './appReducer';
import { initialState } from './initialState';
import { initializeDemoTasks } from './demo/demoTasksInit';
import * as taskActions from './tasks/taskActions';
import * as uiActions from './ui/uiActions';
import { useAuth } from './auth';
import { 
  fetchUserPreferences, 
  updateUserPreferences, 
  extractPreferencesFromState,
  savePreferencesToLocalStorage, 
  loadPreferencesFromLocalStorage,
  applyPreferencesToState
} from '@/services/preferencesService';
import { toast } from '@/hooks/use-toast';

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  
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
  
  // Load user preferences when authenticated
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (currentUser?.id && isAuthenticated) {
        try {
          console.log("[AppProvider] Carregando preferências do usuário autenticado:", currentUser.id);
          const userPreferences = await fetchUserPreferences(currentUser.id);
          
          if (userPreferences) {
            console.log("[AppProvider] Preferências carregadas com sucesso");
            
            // Apply preferences to the app state
            const updatedState = applyPreferencesToState(userPreferences, state);
            
            // Update each setting individually to trigger relevant effects
            if (updatedState.darkMode !== state.darkMode) {
              dispatch({ type: 'TOGGLE_DARK_MODE' });
            }
            
            if (updatedState.viewMode !== state.viewMode) {
              dispatch({ type: 'SET_VIEW_MODE', payload: updatedState.viewMode });
            }
            
            if (updatedState.sidebarOpen !== state.sidebarOpen) {
              dispatch({ type: 'TOGGLE_SIDEBAR' });
            }
            
            // Update view-specific settings
            if (updatedState.showHiddenTasks !== state.showHiddenTasks) {
              dispatch({ type: 'TOGGLE_SHOW_HIDDEN_TASKS' });
            }
            
            if (updatedState.showPillars !== state.showPillars) {
              dispatch({ type: 'TOGGLE_SHOW_PILLARS' });
            }
            
            if (updatedState.showDates !== state.showDates) {
              dispatch({ type: 'TOGGLE_SHOW_DATES' });
            }
            
            if (updatedState.showScores !== state.showScores) {
              dispatch({ type: 'TOGGLE_SHOW_SCORES' });
            }
            
            // Update date display options
            dispatch({ 
              type: 'UPDATE_DATE_DISPLAY_OPTIONS', 
              payload: updatedState.dateDisplayOptions 
            });
            
            // Update sort options for both modes
            dispatch({
              type: 'UPDATE_SORT_OPTIONS',
              payload: {
                viewMode: 'power',
                options: updatedState.sortOptions.power
              }
            });
            
            dispatch({
              type: 'UPDATE_SORT_OPTIONS',
              payload: {
                viewMode: 'chronological',
                options: updatedState.sortOptions.chronological
              }
            });
            
            toast({
              title: "Preferências carregadas",
              description: "Suas preferências pessoais foram aplicadas",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("[AppProvider] Erro ao carregar preferências:", error);
          
          // Try loading from localStorage as fallback
          const localPreferences = loadPreferencesFromLocalStorage();
          if (localPreferences) {
            console.log("[AppProvider] Usando preferências locais como fallback");
            // We could apply local preferences here if needed
          }
        }
      } else if (!isLoading && !isAuthenticated) {
        // For non-authenticated users, try to load from localStorage
        const localPreferences = loadPreferencesFromLocalStorage();
        if (localPreferences) {
          // Apply local preferences (similar logic as above)
          console.log("[AppProvider] Aplicando preferências do localStorage para usuário não autenticado");
        }
      }
    };
    
    loadUserPreferences();
  }, [currentUser?.id, isAuthenticated, isLoading]);
  
  // Update user preferences when state changes
  useEffect(() => {
    const syncPreferences = async () => {
      // Extract current preferences from state
      const currentPreferences = extractPreferencesFromState(state);
      
      // Always save to localStorage as a backup
      savePreferencesToLocalStorage(currentPreferences);
      
      // If authenticated, also sync to database (this is debounced)
      if (currentUser?.id && isAuthenticated) {
        updateUserPreferences(currentUser.id, currentPreferences);
      }
    };
    
    // Skip initial sync on first render
    if (state !== initialState) {
      syncPreferences();
    }
  }, [
    state.darkMode, 
    state.viewMode, 
    state.sidebarOpen, 
    state.showHiddenTasks, 
    state.showPillars, 
    state.showDates, 
    state.showScores, 
    state.dateDisplayOptions, 
    state.sortOptions,
    currentUser?.id,
    isAuthenticated
  ]);

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
    toggleDarkMode: () => uiActions.toggleDarkMode(dispatch),
    toggleSidebar: () => uiActions.toggleSidebar(dispatch),
    toggleShowPillars: () => uiActions.toggleShowPillars(dispatch),
    toggleShowDates: () => uiActions.toggleShowDates(dispatch),
    toggleShowScores: () => uiActions.toggleShowScores(dispatch),
    updateDateDisplayOptions: (options) => uiActions.updateDateDisplayOptions(dispatch, options),
    setSortOptions: (options) => uiActions.setSortOptions(dispatch, options)
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
