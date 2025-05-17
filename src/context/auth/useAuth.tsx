
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { AuthContextType } from './types';

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('[AUTH:HOOK] useAuth usado fora do AuthProvider');
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  console.log(`[AUTH:HOOK] useAuth chamado: Autenticado=${context.isAuthenticated}, Carregando=${context.isLoading}`);
  return context;
};
