
import React, { createContext, useContext } from 'react';
import { User } from '../types/user';
import { useAuth } from './AuthContext';

// User context type
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;  
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Context provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use authentication context directly instead of duplicating state
  const auth = useAuth();
  
  console.log("UserProvider: Using auth state", { 
    isAuthenticated: auth.isAuthenticated, 
    isLoading: auth.isLoading,
    hasUser: !!auth.currentUser
  });
  
  // Value provided by the context - directly passing through from AuthContext
  const value = {
    currentUser: auth.currentUser,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    logout: auth.logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
