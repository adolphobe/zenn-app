
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { simulateLogin, getStoredAuth, clearAuth } from '../mock/authUtils';
import { updateUserPreferences, applyUserPreferences } from '../mock/users';
import { User } from '../types/user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("AuthProvider: Error checking authentication", error);
        setCurrentUser(null);
      } finally {
        console.log("AuthProvider: Authentication check complete");
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
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
        
        return true;
      }
      
      console.log("AuthProvider: Login failed - invalid credentials");
      return false;
    } catch (error) {
      console.error("AuthProvider: Login error", error);
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
    setCurrentUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
