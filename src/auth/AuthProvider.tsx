
import React, { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthCheck } from './hooks/useAuthCheck';
import { setupStorageMonitor } from './monitoring';
import { authLog } from '../mock/authUtils';
import { muteLogsFor } from '../utils/logUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar o monitoramento ao montar o componente
  useEffect(() => {
    authLog("Inicializando AuthProvider");
    setupStorageMonitor();
    
    // Silenciar categorias de log com muitas mensagens
    muteLogsFor("AUTH", 60000); // 1 minuto
    muteLogsFor("AUTH-CHECK", 60000);
    muteLogsFor("TOKEN", 60000);
    
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
