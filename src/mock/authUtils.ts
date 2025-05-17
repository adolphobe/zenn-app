
import { User } from '../types/user';
import { getUserByCredentials, getUserById } from './users';

const TOKEN_KEY = 'acto_auth_token';
const USER_ID_KEY = 'acto_user_id';
const IS_LOGGED_IN_KEY = 'acto_is_logged_in';
const CONNECTION_RETRY_KEY = 'acto_connection_retry';

/**
 * Simulates a login by checking credentials against the mock users
 */
export const simulateLogin = (email: string, password: string): { success: boolean; user: User | null } => {
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
  
  // Limpar qualquer estado de reconexão
  localStorage.removeItem(CONNECTION_RETRY_KEY);
};

/**
 * Gets stored authentication data from localStorage
 */
export const getStoredAuth = (): { user: User | null; isValid: boolean; token: string | null } => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userId = localStorage.getItem(USER_ID_KEY);
  const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
  const tokenExpires = localStorage.getItem(`${TOKEN_KEY}_expires`);
  
  // Check token expiration
  const isExpired = tokenExpires 
    ? new Date(tokenExpires) < new Date() 
    : true;
  
  if (token && userId && isLoggedIn && !isExpired) {
    const user = getUserById(userId);
    return { 
      user, 
      isValid: !!user, 
      token 
    };
  }
  
  // If any condition fails, clear auth data
  if ((token || userId || isLoggedIn) && (isExpired || !token || !userId || !isLoggedIn)) {
    clearAuth();
  }
  
  return { user: null, isValid: false, token: null };
};

/**
 * Stores connection retry state to recover from interrupted connections
 */
export const storeConnectionRetry = (email: string): void => {
  localStorage.setItem(CONNECTION_RETRY_KEY, email);
};

/**
 * Gets connection retry state
 */
export const getConnectionRetry = (): string | null => {
  return localStorage.getItem(CONNECTION_RETRY_KEY);
};

/**
 * Clears connection retry state
 */
export const clearConnectionRetry = (): void => {
  localStorage.removeItem(CONNECTION_RETRY_KEY);
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(`${TOKEN_KEY}_expires`);
};

/**
 * Checks if authentication is valid
 */
export const isAuthValid = (): boolean => {
  const { isValid } = getStoredAuth();
  return isValid;
};
