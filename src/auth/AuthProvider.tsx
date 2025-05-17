
import React, { useState, useEffect } from 'react';
import { AuthContext, AuthErrorType } from './AuthContext';
import { simulateLogin, getStoredAuth, clearAuth, storeAuth } from '../mock/authUtils';
import { updateUserPreferences, applyUserPreferences } from '../mock/users';
import { User } from '../types/user';

const PENDING_LOGIN_KEY = 'acto_pending_login';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorType>(null);
  const [pendingLoginState, setPendingLoginState] = useState<boolean>(false);
  
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
  
  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("AuthProvider: Checking authentication...");
      try {
        const { user, isValid } = getStoredAuth();
        
        if (isValid && user) {
          console.log("AuthProvider: Found valid authentication");
          setCurrentUser(user);
          
          // Apply user preferences
          if (user.preferences) {
            applyUserPreferences(user.preferences);
          }
        } else {
          console.log("AuthProvider: No valid authentication found");
          // Verifica se há um login pendente
          if (checkPendingLogin()) {
            setAuthError('connection_lost');
          } else if (isValid === false) {
            setAuthError('session_expired');
          }
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("AuthProvider: Error checking authentication", error);
        setCurrentUser(null);
        setAuthError('connection_lost');
      } finally {
        console.log("AuthProvider: Authentication check complete");
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Verificar periodicamente a validade do token (a cada 5 minutos)
  useEffect(() => {
    if (!currentUser) return;
    
    const checkTokenValidity = () => {
      const { isValid } = getStoredAuth();
      if (!isValid) {
        console.log("AuthProvider: Token expired during session");
        setAuthError('session_expired');
        setCurrentUser(null);
      }
    };
    
    const intervalId = setInterval(checkTokenValidity, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearAuthError();
    
    try {
      // Armazena o estado de tentativa de login
      localStorage.setItem(PENDING_LOGIN_KEY, 'true');
      setPendingLoginState(true);
      
      const { success, user } = simulateLogin(email, password);
      
      if (success && user) {
        console.log("AuthProvider: Login successful");
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
      
      console.log("AuthProvider: Login failed - invalid credentials");
      setAuthError('invalid_credentials');
      clearPendingLogin();
      return false;
    } catch (error) {
      console.error("AuthProvider: Login error", error);
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
      console.error("AuthProvider: Resume login error", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    console.log("AuthProvider: Logging out");
    if (currentUser) {
      try {
        // Save current preferences before logout
        updateUserPreferences(currentUser.id, currentUser.preferences);
      } catch (error) {
        console.error("AuthProvider: Error saving preferences during logout", error);
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
