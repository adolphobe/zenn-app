
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
  // Using our updated authentication context
  const { currentUser, isLoading, isAuthenticated, logout } = useAuth();
  
  console.log("UserProvider: Received auth state", { 
    isAuthenticated, 
    isLoading,
    hasUser: !!currentUser
  });
  
  // Value provided by the context
  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    logout
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
