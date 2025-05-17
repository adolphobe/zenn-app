
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext, AuthErrorType } from './AuthContext';
import { simulateLogin, getStoredAuth, clearAuth, storeAuth, isAuthValid, wasTokenRecentlyVerified } from '../mock/authUtils';
import { updateUserPreferences, applyUserPreferences } from '../mock/users';
import { User } from '../types/user';
import { useLocation } from 'react-router-dom';

const PENDING_LOGIN_KEY = 'acto_pending_login';
const AUTH_CHECK_INTERVAL = 60 * 1000; // Verificação a cada 1 minuto
const TOKEN_RECENT_THRESHOLD = 30; // Segundos

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorType>(null);
  const [pendingLoginState, setPendingLoginState] = useState<boolean>(false);
  const [lastAuthCheck, setLastAuthCheck] = useState<Date>(new Date());
  const location = useLocation();
  
  // Log com timestamp para rastrear eventos de autenticação
  const logAuth = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] AuthProvider: ${message}`, data || '');
  };
  
  // Verifica se há um login pendente armazenado
  const checkPendingLogin = () => {
    const pendingLogin = localStorage.getItem(PENDING_LOGIN_KEY);
    if (pendingLogin) {
      setPendingLoginState(true);
      return true;
    }
    return false;
  };

  // Limpa o estado de login pendente
  const clearPendingLogin = () => {
    localStorage.removeItem(PENDING_LOGIN_KEY);
    setPendingLoginState(false);
  };
  
  // Verificar a autenticação - função centralizada para verificação de token
  const checkAuth = useCallback(async () => {
    logAuth("Verificando autenticação...");
    setLastAuthCheck(new Date());
    
    try {
      const { user, isValid } = getStoredAuth();
      
      if (isValid && user) {
        logAuth("Autenticação válida encontrada", { userId: user.id });
        setCurrentUser(user);
        setAuthError(null);
        
        // Apply user preferences
        if (user.preferences) {
          applyUserPreferences(user.preferences);
        }
      } else {
        logAuth("Autenticação inválida ou não encontrada", { isValid });
        // Verifica se há um login pendente
        if (checkPendingLogin()) {
          setAuthError('connection_lost');
        } else if (isValid === false) {
          setAuthError('session_expired');
        }
        setCurrentUser(null);
      }
    } catch (error) {
      logAuth("Erro ao verificar autenticação", error);
      setCurrentUser(null);
      setAuthError('connection_lost');
    } finally {
      logAuth("Verificação de autenticação concluída");
      setIsLoading(false);
    }
  }, []);
  
  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Verificar periodicamente a validade do token (intervalo definido)
  useEffect(() => {
    if (!currentUser) return;
    
    const checkTokenValidity = () => {
      const now = new Date();
      const secondsSinceLastCheck = (now.getTime() - lastAuthCheck.getTime()) / 1000;
      
      logAuth(`Verificação periódica de token (${secondsSinceLastCheck.toFixed(1)}s desde última verificação)`);
      
      if (secondsSinceLastCheck > TOKEN_RECENT_THRESHOLD) {
        const { isValid } = getStoredAuth();
        if (!isValid) {
          logAuth("Token expirou durante a sessão");
          setAuthError('session_expired');
          setCurrentUser(null);
        } else {
          logAuth("Token ainda é válido");
        }
        setLastAuthCheck(now);
      }
    };
    
    const intervalId = setInterval(checkTokenValidity, AUTH_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentUser, lastAuthCheck]);
  
  // Verificar autenticação em cada mudança de rota para rotas protegidas
  useEffect(() => {
    // Ajustado para verificar apenas rotas começando com /dashboard
    if (location.pathname.startsWith('/dashboard')) {
      logAuth(`Mudança para rota protegida "${location.pathname}" - verificando autenticação`);
      
      // Forçar verificação em cada mudança de rota protegida
      const { isValid } = getStoredAuth();
      if (!isValid && currentUser) {
        logAuth("Token inválido detectado na mudança de rota");
        setAuthError('session_expired');
        setCurrentUser(null);
      } else if (isValid && currentUser) {
        logAuth("Token válido na mudança de rota");
      }
      
      // Atualiza timestamp da última verificação
      setLastAuthCheck(new Date());
    }
  }, [location.pathname, currentUser]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearAuthError();
    
    try {
      // Armazena o estado de tentativa de login
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
        
        // Limpa o estado de tentativa de login após sucesso
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
  };
  
  const resumePendingLogin = async (): Promise<boolean> => {
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
  };
  
  const logout = () => {
    logAuth("Realizando logout", currentUser ? { userId: currentUser.id } : undefined);
    if (currentUser) {
      try {
        // Save current preferences before logout
        updateUserPreferences(currentUser.id, currentUser.preferences);
      } catch (error) {
        logAuth("Erro ao salvar preferências durante logout", error);
      }
    }
    
    clearAuth();
    clearPendingLogin();
    setCurrentUser(null);
    setAuthError(null);
  };
  
  const clearAuthError = () => {
    setAuthError(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        authError,
        pendingLoginState,
        login,
        logout,
        clearAuthError,
        resumePendingLogin,
        checkAuth // Exportando para uso em componentes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
