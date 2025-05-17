
import React from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthCheck } from './hooks/useAuthCheck';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
