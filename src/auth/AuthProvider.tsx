
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext, AuthErrorType } from './AuthContext';
import { simulateLogin, getStoredAuth, clearAuth, storeAuth, isAuthValid, wasTokenRecentlyVerified } from '../mock/authUtils';
import { updateUserPreferences, applyUserPreferences } from '../mock/users';
import { User } from '../types/user';
import { useLocation } from 'react-router-dom';

const PENDING_LOGIN_KEY = 'acto_pending_login';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorType>(null);
  const [pendingLoginState, setPendingLoginState] = useState<boolean>(false);
  const location = useLocation();
  
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
  
  // Verificar a autenticação - agora como uma função que pode ser chamada de vários pontos
  const checkAuth = useCallback(async () => {
    console.log("AuthProvider: Verificando autenticação...");
    try {
      const { user, isValid } = getStoredAuth();
      
      if (isValid && user) {
        console.log("AuthProvider: Autenticação válida encontrada");
        setCurrentUser(user);
        setAuthError(null);
        
        // Apply user preferences
        if (user.preferences) {
          applyUserPreferences(user.preferences);
        }
      } else {
        console.log("AuthProvider: Autenticação inválida ou não encontrada");
        // Verifica se há um login pendente
        if (checkPendingLogin()) {
          setAuthError('connection_lost');
        } else if (isValid === false) {
          setAuthError('session_expired');
        }
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("AuthProvider: Erro ao verificar autenticação", error);
      setCurrentUser(null);
      setAuthError('connection_lost');
    } finally {
      console.log("AuthProvider: Verificação de autenticação concluída");
      setIsLoading(false);
    }
  }, []);
  
  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Verificar periodicamente a validade do token (a cada 5 minutos)
  useEffect(() => {
    if (!currentUser) return;
    
    const checkTokenValidity = () => {
      if (!wasTokenRecentlyVerified(30)) {  // Só verifica se não foi verificado nos últimos 30 segundos
        const { isValid } = getStoredAuth();
        if (!isValid) {
          console.log("AuthProvider: Token expirou durante a sessão");
          setAuthError('session_expired');
          setCurrentUser(null);
        }
      }
    };
    
    const intervalId = setInterval(checkTokenValidity, 60 * 1000); // Verificar a cada 1 minuto
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  // Verificar autenticação em cada mudança de rota para maior segurança
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard') || 
        location.pathname === '/strategic-review' ||
        location.pathname === '/history') {
      console.log(`AuthProvider: Mudança para rota protegida "${location.pathname}" - verificando autenticação`);
      
      // Verifica se o token foi verificado recentemente para evitar muitas chamadas
      if (!wasTokenRecentlyVerified(5)) {
        const { isValid } = getStoredAuth();
        if (!isValid && currentUser) {
          console.log("AuthProvider: Token inválido detectado na mudança de rota");
          setAuthError('session_expired');
          setCurrentUser(null);
        }
      }
    }
  }, [location.pathname, currentUser]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearAuthError();
    
    try {
      // Armazena o estado de tentativa de login
      localStorage.setItem(PENDING_LOGIN_KEY, 'true');
      setPendingLoginState(true);
      
      const { success, user } = simulateLogin(email, password);
      
      if (success && user) {
        console.log("AuthProvider: Login bem-sucedido");
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
      
      console.log("AuthProvider: Falha no login - credenciais inválidas");
      setAuthError('invalid_credentials');
      clearPendingLogin();
      return false;
    } catch (error) {
      console.error("AuthProvider: Erro durante login", error);
      setAuthError('connection_lost');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resumePendingLogin = async (): Promise<boolean> => {
    if (!pendingLoginState) return false;
    
    setIsLoading(true);
    
    try {
      const { user, isValid } = getStoredAuth();
      
      if (isValid && user) {
        setCurrentUser(user);
        clearPendingLogin();
        return true;
      }
      
      clearPendingLogin();
      return false;
    } catch (error) {
      console.error("AuthProvider: Erro ao retomar login", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    console.log("AuthProvider: Realizando logout");
    if (currentUser) {
      try {
        // Save current preferences before logout
        updateUserPreferences(currentUser.id, currentUser.preferences);
      } catch (error) {
        console.error("AuthProvider: Erro ao salvar preferências durante logout", error);
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
        resumePendingLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
