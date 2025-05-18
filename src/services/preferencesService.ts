
import { supabase } from '@/integrations/supabase/client';
import { User, UserPreferences } from '@/types/user';
import { AppState } from '@/context/types';
import { debounce } from 'lodash';

// Function to extract preferences from app state
export const extractPreferencesFromState = (state: AppState): UserPreferences => {
  return {
    darkMode: state.darkMode,
    activeViewMode: state.viewMode,
    sidebarOpen: state.sidebarOpen,
    viewModeSettings: {
      power: {
        showHiddenTasks: state.viewModeSettings.power.showHiddenTasks,
        showPillars: state.viewModeSettings.power.showPillars,
        showDates: state.viewModeSettings.power.showDates,
        showScores: state.viewModeSettings.power.showScores,
        sortOptions: state.sortOptions.power,
      },
      chronological: {
        showHiddenTasks: state.viewModeSettings.chronological.showHiddenTasks,
        showPillars: state.viewModeSettings.chronological.showPillars,
        showDates: state.viewModeSettings.chronological.showDates,
        showScores: state.viewModeSettings.chronological.showScores,
        sortOptions: state.sortOptions.chronological,
      }
    },
    dateDisplayOptions: state.dateDisplayOptions
  };
};

// Function to apply preferences to app state
export const applyPreferencesToState = (preferences: UserPreferences, state: AppState): AppState => {
  return {
    ...state,
    darkMode: preferences.darkMode,
    viewMode: preferences.activeViewMode,
    sidebarOpen: preferences.sidebarOpen,
    showHiddenTasks: preferences.viewModeSettings[preferences.activeViewMode].showHiddenTasks,
    showPillars: preferences.viewModeSettings[preferences.activeViewMode].showPillars,
    showDates: preferences.viewModeSettings[preferences.activeViewMode].showDates,
    showScores: preferences.viewModeSettings[preferences.activeViewMode].showScores,
    viewModeSettings: preferences.viewModeSettings,
    dateDisplayOptions: preferences.dateDisplayOptions,
    sortOptions: {
      power: preferences.viewModeSettings.power.sortOptions,
      chronological: preferences.viewModeSettings.chronological.sortOptions
    }
  };
};

// Function to get user preferences from Supabase
export const fetchUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    console.log("[PreferencesService] Buscando preferências do usuário:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("[PreferencesService] Erro ao buscar preferências:", error);
      console.error("[PreferencesService] DETALHES EM PORTUGUÊS: Falha ao carregar preferências do usuário");
      return null;
    }
    
    return data?.preferences || null;
  } catch (error) {
    console.error("[PreferencesService] Erro inesperado ao buscar preferências:", error);
    console.error("[PreferencesService] DETALHES EM PORTUGUÊS: Ocorreu um erro ao carregar as preferências");
    return null;
  }
};

// Create a debounced function to update user preferences
export const updateUserPreferences = debounce(async (
  userId: string, 
  preferences: UserPreferences
): Promise<UserPreferences | null> => {
  try {
    console.log("[PreferencesService] Atualizando preferências do usuário após debounce:", userId);
    
    const { data, error } = await supabase
      .rpc('update_user_preferences', {
        user_id: userId,
        user_preferences: preferences
      });
    
    if (error) {
      console.error("[PreferencesService] Erro ao atualizar preferências:", error);
      console.error("[PreferencesService] DETALHES EM PORTUGUÊS: Falha ao salvar preferências do usuário");
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("[PreferencesService] Erro inesperado ao atualizar preferências:", error);
    console.error("[PreferencesService] DETALHES EM PORTUGUÊS: Ocorreu um erro ao salvar as preferências");
    return null;
  }
}, 10000); // 10 seconds debounce as requested

// Function to update user preferences to localStorage (for non-authenticated users)
export const savePreferencesToLocalStorage = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem('app_preferences', JSON.stringify(preferences));
  } catch (error) {
    console.error("[PreferencesService] Erro ao salvar preferências no localStorage:", error);
  }
};

// Function to load user preferences from localStorage
export const loadPreferencesFromLocalStorage = (): UserPreferences | null => {
  try {
    const preferencesStr = localStorage.getItem('app_preferences');
    return preferencesStr ? JSON.parse(preferencesStr) : null;
  } catch (error) {
    console.error("[PreferencesService] Erro ao carregar preferências do localStorage:", error);
    return null;
  }
};
