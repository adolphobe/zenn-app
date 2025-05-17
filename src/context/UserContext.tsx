
import React, { createContext, useContext } from 'react';
import { User } from '../types/user';
import { useAuth } from '@/auth/useAuth';

// Tipo do contexto do usuário
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  logout: () => void;  // Adicionando método logout ao tipo
}

// Criação do contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider do contexto
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading: authLoading, logout } = useAuth();
  
  // Valor fornecido pelo contexto
  const value = {
    currentUser,
    isLoading: authLoading,
    logout     // Passando o método logout do AuthContext
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
