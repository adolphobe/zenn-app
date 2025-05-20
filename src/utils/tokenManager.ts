
import { 
  SUPABASE_AUTH_TOKEN_KEY, 
  LEGACY_AUTH_TOKEN_KEY, 
  LOGOUT_IN_PROGRESS_KEY,
  LOGIN_SUCCESS_KEY
} from './authConstants';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage';

/**
 * Gerenciador centralizado de tokens e flags de autenticação
 * Evita inconsistências no tratamento de tokens
 */
export const TokenManager = {
  // Verifica se existe um token de autenticação
  hasAuthToken: (): boolean => {
    return !!localStorage.getItem(SUPABASE_AUTH_TOKEN_KEY);
  },

  // Limpa todos os tokens relacionados à autenticação
  clearAllTokens: (): void => {
    localStorage.removeItem(SUPABASE_AUTH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  },

  // Gerenciamento da flag de logout em andamento
  isLogoutInProgress: (): boolean => {
    return localStorage.getItem(LOGOUT_IN_PROGRESS_KEY) === 'true';
  },

  setLogoutInProgress: (inProgress: boolean): void => {
    if (inProgress) {
      localStorage.setItem(LOGOUT_IN_PROGRESS_KEY, 'true');
    } else {
      localStorage.removeItem(LOGOUT_IN_PROGRESS_KEY);
    }
  },

  // Gerenciamento da flag de login bem-sucedido
  setLoginSuccess: (success: boolean): void => {
    if (success) {
      localStorage.setItem(LOGIN_SUCCESS_KEY, 'true');
    } else {
      localStorage.removeItem(LOGIN_SUCCESS_KEY);
    }
  },

  hasLoginSuccess: (): boolean => {
    return localStorage.getItem(LOGIN_SUCCESS_KEY) === 'true';
  },

  // Limpa todas as flags relacionadas à autenticação
  clearAllFlags: (): void => {
    localStorage.removeItem(LOGOUT_IN_PROGRESS_KEY);
    localStorage.removeItem(LOGIN_SUCCESS_KEY);
  }
};
