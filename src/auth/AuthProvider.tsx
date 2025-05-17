
import React, { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthCheck } from './hooks/useAuthCheck';
import { setupStorageMonitor } from './monitoring';
import { authLog } from '../mock/authUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar o monitoramento ao montar o componente
  useEffect(() => {
    authLog("Inicializando AuthProvider");
    setupStorageMonitor();
    
    return () => {
      authLog("Desmontando AuthProvider");
    };
  }, []);
  
  // Use our custom hooks for auth state and auth checking
  const authState = useAuthState();
  const { checkAuth } = useAuthCheck(authState);
  
  const { 
    currentUser, 
    isLoading, 
    authError, 
    pendingLoginState,
    login, 
    logout, 
    clearAuthError, 
    resumePendingLogin 
  } = authState;

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
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
