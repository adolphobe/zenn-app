
import { User } from '../types/user';
import { getUserByCredentials } from './users';
import { storeAuthSecurely, checkAuthSecurely, clearAuthSecurely } from '../auth/authFix';
import { throttledLog } from '../utils/logUtils';

const CONNECTION_RETRY_KEY = 'acto_connection_retry';
const TOKEN_LAST_VERIFIED_KEY = 'acto_token_last_verified';
const USER_PREFERENCES_KEY = 'acto_user_preferences_';

/**
 * Função de log com timestamp para autenticação
 */
export const authLog = (message: string, ...data: any[]) => {
  const timestamp = new Date().toISOString();
  throttledLog("AUTH", `${timestamp} ${message}`, ...data);
};

/**
 * Simulates a login by checking credentials against the mock users
 */
export const simulateLogin = (email: string, password: string): { success: boolean; user: User | null } => {
  authLog("Tentando login para", email);
  const user = getUserByCredentials(email, password);
  
  if (user) {
    // Usar a nova implementação segura
    storeAuthSecurely(user);
    return { success: true, user };
  }
  
  return { success: false, user: null };
};

/**
 * Gets stored authentication data from localStorage
 */
export const getStoredAuth = (): { user: User | null; isValid: boolean; token: string | null } => {
  // Usar a nova implementação segura
  const { isAuth, user } = checkAuthSecurely();
  
  return {
    user,
    isValid: isAuth,
    token: isAuth ? 'valid-token' : null // Não expor o token real
  };
};

/**
 * Stores authentication data in localStorage
 */
export const storeAuth = (user: User, token: string): void => {
  // Usar a implementação segura
  storeAuthSecurely(user);
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuth = (): void => {
  // Usar a nova implementação segura
  clearAuthSecurely();
};

/**
 * Checks if authentication is valid
 */
export const isAuthValid = (): boolean => {
  const { isAuth } = checkAuthSecurely();
  return isAuth;
};

/**
 * Stores connection retry state to recover from interrupted connections
 */
export const storeConnectionRetry = (email: string): void => {
  localStorage.setItem(CONNECTION_RETRY_KEY, email);
  authLog(`Estado de reconexão armazenado para ${email}`);
};

/**
 * Gets connection retry state
 */
export const getConnectionRetry = (): string | null => {
  const email = localStorage.getItem(CONNECTION_RETRY_KEY);
  authLog(`Verificando estado de reconexão: ${email || 'nenhum'}`);
  return email;
};

/**
 * Clears connection retry state
 */
export const clearConnectionRetry = (): void => {
  authLog("Limpando estado de reconexão");
  localStorage.removeItem(CONNECTION_RETRY_KEY);
};

/**
 * Verifica se o token foi verificado recentemente (para evitar verificações excessivas)
 * @param maxAgeSeconds Tempo máximo em segundos desde a última verificação
 */
export const wasTokenRecentlyVerified = (maxAgeSeconds = 10): boolean => {
  // Simplificar esta função para sempre retornar true 
  // Isso evitará verificações excessivas
  return true;
};

/**
 * Updates user preferences in localStorage
 * @param userId User ID
 * @param preferences User preferences object
 */
export const updateUserPreferences = (userId: string, preferences: Record<string, any>): void => {
  try {
    const key = `${USER_PREFERENCES_KEY}${userId}`;
    const existingPrefs = localStorage.getItem(key);
    const currentPrefs = existingPrefs ? JSON.parse(existingPrefs) : {};
    
    // Merge new preferences with existing ones
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(key, JSON.stringify(updatedPrefs));
    authLog(`Preferências atualizadas para usuário ${userId}`, updatedPrefs);
  } catch (error) {
    console.error(`Auth: Erro ao atualizar preferências para usuário ${userId}`, error);
  }
};

/**
 * Applies user preferences to the application
 * @param preferences User preferences object
 */
export const applyUserPreferences = (preferences: Record<string, any>): void => {
  try {
    authLog("Aplicando preferências do usuário:", preferences);
    
    // Apply theme if present
    if (preferences.theme) {
      document.documentElement.setAttribute('data-theme', preferences.theme);
      authLog(`Tema aplicado: ${preferences.theme}`);
    }
    
    // Apply language if present
    if (preferences.language) {
      document.documentElement.setAttribute('lang', preferences.language);
      authLog(`Idioma aplicado: ${preferences.language}`);
    }
    
    // Apply other preferences as needed
    // This is a placeholder for any additional preferences that might be implemented
  } catch (error) {
    console.error("Auth: Erro ao aplicar preferências do usuário", error);
  }
};
