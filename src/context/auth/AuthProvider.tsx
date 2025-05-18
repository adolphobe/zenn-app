
import { createContext, useContext, ReactNode } from 'react';
import { User } from '../../types/user';
import { Session } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => false,
  logout: async () => {},
  session: null,
  sendPasswordResetEmail: async () => ({ success: false }),
});

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use our custom hooks
  const {
    currentUser,
    setCurrentUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    authInitialized
  } = useAuthState();

  const {
    login,
    signup,
    logout,
    sendPasswordResetEmail
  } = useAuthActions({
    setCurrentUser,
    setSession,
    setIsLoading
  });
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!session && !!currentUser,
    isLoading: isLoading || !authInitialized,
    login,
    signup,
    logout,
    session,
    sendPasswordResetEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
