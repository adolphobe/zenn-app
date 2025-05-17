
import React, { createContext, useContext } from 'react';
import { User } from '../types/user';
import { useAuth } from '../context/AuthContext';

// Tipo do contexto do usuário
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;  
}

// Criação do contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider do contexto
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Agora estamos usando nosso contexto de autenticação atualizado
  const { currentUser, isLoading, isAuthenticated, logout } = useAuth();
  
  // Valor fornecido pelo contexto
  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
