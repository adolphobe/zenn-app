
import React, { createContext, useContext, useEffect } from 'react';
import { User } from '../types/user';
import { useAuth } from '@/auth/useAuth';

// Tipo do contexto do usuário
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean; // Adicionando propriedade para consistência com AuthContext
  authError: string | null; // Adicionando propriedade para consistência com AuthContext
  logout: () => void;  
}

// Criação do contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider do contexto
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading, isAuthenticated, authError, logout } = useAuth();
  
  // Log para depuração da sincronia entre contextos
  useEffect(() => {
    console.log("UserContext: Estado de autenticação atualizado =>", 
      isAuthenticated ? "Autenticado" : "Não autenticado", 
      authError ? `(Erro: ${authError})` : "");
  }, [isAuthenticated, authError]);
  
  // Valor fornecido pelo contexto
  const value = {
    currentUser,
    isLoading,
    isAuthenticated, // Sincronizando com AuthContext
    authError,       // Sincronizando com AuthContext
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
