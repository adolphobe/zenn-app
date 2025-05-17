
import React, { createContext, useContext } from 'react';
import { User } from '../types/user';
import { useAuth } from './AuthContext';

// Tipo do contexto do usuário
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;  
}

// Criar contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider do contexto - apenas um wrapper para o AuthContext
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar o contexto de autenticação diretamente
  const auth = useAuth();
  
  // Simplificar e passar diretamente do AuthContext
  const value = {
    currentUser: auth.currentUser,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    logout: auth.logout
  };

  // Apenas um wrapper - não adiciona nenhum estado ou lógica adicional
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
