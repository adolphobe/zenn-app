import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { AppContext } from './AppContext';
import { AppContextType, SortOptionsUpdate } from './types';
import { appReducer } from './appReducer';
import { initialState } from './initialState';
import * as uiActions from './ui/uiActions';
import { useAuth } from './auth';
import { 
  fetchTasks as fetchTasksFromDB,
} from '@/services/taskService';
import { 
  fetchUserPreferences, 
  updateUserPreferences, 
  extractPreferencesFromState,
  savePreferencesToLocalStorage, 
  loadPreferencesFromLocalStorage,
  applyPreferencesToState
} from '@/services/preferencesService';
import { toast } from '@/hooks/use-toast';
import { useTaskStore, useAuthStore } from '@/hooks/useTaskStore';
import { v4 as uuidv4 } from 'uuid';
import { 
  addTask,
  deleteTask,
  toggleTaskCompleted,
  toggleTaskHidden,
  updateTask,
  updateTaskTitle,
  setTaskFeedback,
  restoreTask,
  syncTasksFromDatabase
} from './tasks';

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  
  // Store tasks in DOM for access by non-React components
  useTaskStore(state.tasks);
  
  // Store user in DOM for access by non-React components
  useAuthStore(currentUser);
  
  // Function to reload tasks from the database
  const syncTasksWithDatabase = useCallback(async (forceSync: boolean = false) => {
    if (!currentUser?.id || !isAuthenticated || (isSyncing && !forceSync)) return;
    
    const now = Date.now();
    // Only sync if it's been at least 5 seconds since last sync or force sync is true
    if (!forceSync && now - lastSyncTime < 5000) {
      console.log("Skipping sync, last sync was less than 5 seconds ago");
      return;
    }
    
    try {
      setIsSyncing(true);
      console.log("[AppProvider] Sincronizando tarefas do usuário:", currentUser.id);
      
      const allTasks = await syncTasksFromDatabase(dispatch, currentUser.id);
      
      setLastSyncTime(now);
      console.log("[AppProvider] Tarefas sincronizadas:", allTasks?.length || 0);
      
      return allTasks;
    } catch (error) {
      console.error("[AppProvider] Erro ao sincronizar tarefas:", error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao sincronizar tarefas",
        description: "Não foi possível carregar suas tarefas. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser?.id, isAuthenticated, isSyncing, lastSyncTime]);
  
  // Load tasks from Supabase when authenticated
  useEffect(() => {
    if (currentUser?.id && isAuthenticated && !isSyncing) {
      syncTasksWithDatabase();
    }
  }, [currentUser?.id, isAuthenticated, syncTasksWithDatabase]);
  
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

  // Create context value object with all actions - updated for mode-specific toggleShowPillars
  const contextValue: AppContextType = {
    state,
    dispatch,
    // Task actions
    addTask: (task) => addTask(dispatch, task),
    deleteTask: (id) => deleteTask(dispatch, id),
    toggleTaskCompleted: (id) => toggleTaskCompleted(dispatch, id),
    toggleTaskHidden: (id) => toggleTaskHidden(dispatch, id),
    updateTask: (id, data) => updateTask(dispatch, id, data),
    updateTaskTitle: (id, title) => updateTaskTitle(dispatch, id, title),
    setTaskFeedback: (id, feedback) => setTaskFeedback(dispatch, id, feedback),
    restoreTask: (id) => restoreTask(dispatch, id),
    syncTasksWithDatabase: (forceSync = true) => syncTasksWithDatabase(forceSync),
    
    // UI actions
    setViewMode: (mode) => uiActions.setViewMode(dispatch, mode),
    toggleShowHiddenTasks: () => uiActions.toggleShowHiddenTasks(dispatch),
    toggleDarkMode: () => uiActions.toggleDarkMode(dispatch),
    toggleSidebar: () => uiActions.toggleSidebar(dispatch),
    toggleShowPillars: (mode) => uiActions.toggleShowPillars(dispatch, mode),
    toggleShowDates: () => uiActions.toggleShowDates(dispatch),
    toggleShowScores: () => uiActions.toggleShowScores(dispatch),
    updateDateDisplayOptions: (options) => uiActions.updateDateDisplayOptions(dispatch, options),
    setSortOptions: (options) => uiActions.setSortOptions(dispatch, options),
    toggleViewMode: () => dispatch({ type: 'TOGGLE_VIEW_MODE' })
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
