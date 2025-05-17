
import { User } from '../types/user';
import { getUserByCredentials, getUserById } from './users';

const TOKEN_KEY = 'acto_auth_token';
const USER_ID_KEY = 'acto_user_id';
const IS_LOGGED_IN_KEY = 'acto_is_logged_in';
const CONNECTION_RETRY_KEY = 'acto_connection_retry';
const TOKEN_LAST_VERIFIED_KEY = 'acto_token_last_verified';
const USER_PREFERENCES_KEY = 'acto_user_preferences_';

/**
 * Função de log com timestamp para autenticação
 */
export const authLog = (message: string, ...data: any[]) => {
  const timestamp = new Date().toISOString();
  console.log(`[AUTH ${timestamp}] ${message}`, ...data);
};

/**
 * Simulates a login by checking credentials against the mock users
 */
export const simulateLogin = (email: string, password: string): { success: boolean; user: User | null } => {
  authLog("Tentando login para", email);
  const user = getUserByCredentials(email, password);
  if (user) {
    // Create a simple token (in a real app, this would be JWT or similar)
    const token = btoa(`${user.id}:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`);
    storeAuth(user, token);
    return { success: true, user };
  }
  return { success: false, user: null };
};

/**
 * Stores authentication data in localStorage
 */
export const storeAuth = (user: User, token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, user.id);
  localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
  
  // Set token expiration (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  localStorage.setItem(`${TOKEN_KEY}_expires`, expiresAt.toISOString());
  
  // Registra o horário da última verificação de token
  localStorage.setItem(TOKEN_LAST_VERIFIED_KEY, new Date().toISOString());
  
  // Limpar qualquer estado de reconexão
  localStorage.removeItem(CONNECTION_RETRY_KEY);
  
  authLog("Token armazenado e expira em " + expiresAt + " para usuário " + user.id);
};

/**
 * Gets stored authentication data from localStorage
 */
export const getStoredAuth = (): { user: User | null; isValid: boolean; token: string | null } => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userId = localStorage.getItem(USER_ID_KEY);
  const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
  const tokenExpires = localStorage.getItem(`${TOKEN_KEY}_expires`);
  
  authLog(`Verificando token: token=${!!token}, userId=${userId}, isLoggedIn=${isLoggedIn}, expira=${tokenExpires || 'N/A'}`);
  
  // Registra a verificação do token com timestamp
  const now = new Date();
  localStorage.setItem(TOKEN_LAST_VERIFIED_KEY, now.toISOString());
  
  // Check token expiration
  const isExpired = tokenExpires 
    ? new Date(tokenExpires) < now
    : true;
  
  if (token && userId && isLoggedIn && !isExpired) {
    const user = getUserById(userId);
    authLog(`Token válido para usuário ${userId}, expira em ${tokenExpires}`);
    return { 
      user, 
      isValid: !!user, 
      token 
    };
  }
  
  // If any condition fails, log exactly why
  if (!token) authLog("Falha na autenticação: token ausente");
  if (!userId) authLog("Falha na autenticação: userId ausente");
  if (!isLoggedIn) authLog("Falha na autenticação: isLoggedIn ausente ou falso");
  if (isExpired && tokenExpires) authLog(`Falha na autenticação: token expirado em ${tokenExpires}, agora é ${now.toISOString()}`);
  
  // If any condition fails, clear auth data
  if ((token || userId || isLoggedIn) && (isExpired || !token || !userId || !isLoggedIn)) {
    authLog("Limpando dados de autenticação devido a falha nas condições");
    clearAuth();
  }
  
  return { user: null, isValid: false, token: null };
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
 * Clears authentication data from localStorage
 */
export const clearAuth = (): void => {
  authLog("Limpando dados de autenticação");
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(`${TOKEN_KEY}_expires`);
  localStorage.removeItem(TOKEN_LAST_VERIFIED_KEY);
};

/**
 * Checks if authentication is valid
 */
export const isAuthValid = (): boolean => {
  authLog("Verificando validade do token");
  const { isValid } = getStoredAuth();
  return isValid;
};

/**
 * Verifica se o token foi verificado recentemente (para evitar verificações excessivas)
 * @param maxAgeSeconds Tempo máximo em segundos desde a última verificação
 */
export const wasTokenRecentlyVerified = (maxAgeSeconds = 10): boolean => {
  const lastVerified = localStorage.getItem(TOKEN_LAST_VERIFIED_KEY);
  if (!lastVerified) {
    authLog("Token nunca foi verificado");
    return false;
  }
  
  const lastVerifiedTime = new Date(lastVerified).getTime();
  const currentTime = new Date().getTime();
  const secondsSinceVerification = (currentTime - lastVerifiedTime) / 1000;
  
  authLog(`Última verificação há ${secondsSinceVerification.toFixed(1)} segundos`);
  
  return secondsSinceVerification <= maxAgeSeconds;
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
