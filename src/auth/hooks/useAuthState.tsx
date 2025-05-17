
import { useState, useCallback } from 'react';
import { AuthErrorType } from '../AuthContext';
import { User } from '../../types/user';
import { 
  simulateLogin, 
  getStoredAuth, 
  clearAuth, 
  updateUserPreferences, 
  applyUserPreferences 
} from '../../mock/authUtils';

const PENDING_LOGIN_KEY = 'acto_pending_login';

// Custom hook to manage authentication state
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorType>(null);
  const [pendingLoginState, setPendingLoginState] = useState<boolean>(false);
  const [lastAuthCheck, setLastAuthCheck] = useState<Date>(new Date());

  // Log with timestamp for tracing authentication events
  const logAuth = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] AuthProvider: ${message}`, data || '');
  };

  // Check if there's a pending login stored
  const checkPendingLogin = useCallback(() => {
    const pendingLogin = localStorage.getItem(PENDING_LOGIN_KEY);
    if (pendingLogin) {
      setPendingLoginState(true);
      return true;
    }
    return false;
  }, []);

  // Clear pending login state
  const clearPendingLogin = useCallback(() => {
    localStorage.removeItem(PENDING_LOGIN_KEY);
    setPendingLoginState(false);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Store login attempt state
      localStorage.setItem(PENDING_LOGIN_KEY, 'true');
      setPendingLoginState(true);
      
      logAuth("Tentando login", { email });
      const { success, user } = simulateLogin(email, password);
      
      if (success && user) {
        logAuth("Login bem-sucedido", { userId: user.id });
        setCurrentUser(user);
        
        // Apply user preferences
        if (user.preferences) {
          applyUserPreferences(user.preferences);
        }
        
        // Update last login time
        updateUserPreferences(user.id, {});
        
        // Clear pending login state after success
        clearPendingLogin();
        
        return true;
      }
      
      logAuth("Falha no login - credenciais inválidas");
      setAuthError('invalid_credentials');
      clearPendingLogin();
      return false;
    } catch (error) {
      logAuth("Erro durante login", error);
      setAuthError('connection_lost');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearPendingLogin, logAuth]);

  // Resume a pending login
  const resumePendingLogin = useCallback(async (): Promise<boolean> => {
    if (!pendingLoginState) return false;
    
    setIsLoading(true);
    logAuth("Tentando retomar login pendente");
    
    try {
      const { user, isValid } = getStoredAuth();
      
      if (isValid && user) {
        logAuth("Login pendente retomado com sucesso", { userId: user.id });
        setCurrentUser(user);
        clearPendingLogin();
        return true;
      }
      
      logAuth("Falha ao retomar login pendente");
      clearPendingLogin();
      return false;
    } catch (error) {
      logAuth("Erro ao retomar login", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pendingLoginState, clearPendingLogin, logAuth]);

  // Logout function
  const logout = useCallback(() => {
    logAuth("Realizando logout", currentUser ? { userId: currentUser.id } : undefined);
    if (currentUser) {
      try {
        // Save preferences before logout
        updateUserPreferences(currentUser.id, currentUser.preferences);
      } catch (error) {
        logAuth("Erro ao salvar preferências durante logout", error);
      }
    }
    
    clearAuth();
    clearPendingLogin();
    setCurrentUser(null);
    setAuthError(null);
  }, [currentUser, clearPendingLogin, logAuth]);

  // Clear authentication error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    authError,
    setAuthError,
    pendingLoginState,
    lastAuthCheck,
    setLastAuthCheck,
    checkPendingLogin,
    clearPendingLogin,
    login,
    resumePendingLogin,
    logout,
    clearAuthError,
    logAuth
  };
};
