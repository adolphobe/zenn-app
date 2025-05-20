import { supabase } from '@/integrations/supabase/client';
import { AppState, ViewModeSettings, SortOption } from '@/types';

// Function to fetch user preferences from the database
export const fetchUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching user preferences:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching user preferences:", error);
    return null;
  }
};

// Function to update user preferences in the database
export const updateUserPreferences = async (userId: string, preferences: any) => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: userId,
          ...preferences,
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error("Error updating user preferences:", error);
    }
  } catch (error) {
    console.error("Unexpected error updating user preferences:", error);
  }
};

// Function to save preferences to local storage
export const savePreferencesToLocalStorage = (preferences: any) => {
  try {
    const serializedPreferences = JSON.stringify(preferences);
    localStorage.setItem('user_preferences', serializedPreferences);
  } catch (error) {
    console.error("Error saving preferences to local storage:", error);
  }
};

// Function to load preferences from local storage
export const loadPreferencesFromLocalStorage = () => {
  try {
    const serializedPreferences = localStorage.getItem('user_preferences');
    if (serializedPreferences === null) {
      return null;
    }
    return JSON.parse(serializedPreferences);
  } catch (error) {
    console.error("Error loading preferences from local storage:", error);
    return null;
  }
};

// Função para aplicar preferências ao estado
export const applyPreferencesToState = (preferences: any, state: any) => {
  return {
    ...state,
    // Configurações gerais
    darkMode: preferences.darkMode ?? state.darkMode,
    viewMode: preferences.viewMode ?? state.viewMode,
    sidebarOpen: preferences.sidebarOpen ?? state.sidebarOpen,
    
    // Configurações específicas de visualização
    showHiddenTasks: preferences.showHiddenTasks ?? state.showHiddenTasks,
    showPillars: preferences.showPillars ?? state.showPillars,
    showDates: preferences.showDates ?? state.showDates,
    showScores: preferences.showScores ?? state.showScores,
    
    // Configurações de exibição de data
    dateDisplayOptions: preferences.dateDisplayOptions ?? state.dateDisplayOptions,
    
    // Configurações de ordenação
    sortOptions: preferences.sortOptions ?? state.sortOptions,
    
    // Configurações específicas de modo
    viewModeSettings: {
      power: preferences.viewModeSettings?.power ?? state.viewModeSettings.power,
      chronological: preferences.viewModeSettings?.chronological ?? state.viewModeSettings.chronological,
      strategic: preferences.viewModeSettings?.strategic ?? state.viewModeSettings.strategic
    }
  };
};

// Função para extrair preferências do estado
export const extractPreferencesFromState = (state: any) => {
  return {
    darkMode: state.darkMode,
    viewMode: state.viewMode,
    sidebarOpen: state.sidebarOpen,
    showHiddenTasks: state.showHiddenTasks,
    showPillars: state.showPillars,
    showDates: state.showDates,
    showScores: state.showScores,
    dateDisplayOptions: state.dateDisplayOptions,
    sortOptions: state.sortOptions,
    viewModeSettings: {
      power: state.viewModeSettings.power,
      chronological: state.viewModeSettings.chronological,
      strategic: state.viewModeSettings.strategic
    }
  };
};
