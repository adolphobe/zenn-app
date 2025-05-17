
import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { AuthContextType } from './types';

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error('[AUTH:HOOK] useAuth usado fora do AuthProvider');
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  useEffect(() => {
    const authStatus = context.isAuthenticated ? 'Autenticado' : 'Não autenticado';
    const loadingStatus = context.isLoading ? 'Carregando' : 'Carregamento concluído';
    const userEmail = context.currentUser?.email || 'nenhum';
    
    console.log(`[AUTH:HOOK] useAuth inicializado: ${authStatus}, ${loadingStatus}, Usuário=${userEmail}`);
    
    return () => {
      console.log('[AUTH:HOOK] useAuth sendo desmontado');
    };
  }, [context.isAuthenticated, context.isLoading, context.currentUser]);
  
  // Logging each time the hook is used (using a function to avoid ReactNode issues)
  const logHookUsage = () => {
    const callerComponent = new Error().stack?.split('\n')[2]?.trim() || 'Desconhecido';
    console.log(`[AUTH:HOOK] useAuth chamado de ${callerComponent}: Auth=${context.isAuthenticated}, Loading=${context.isLoading}, User=${context.currentUser?.email || 'nenhum'}`);
    return null;
  };
  
  // Call the logging function
  logHookUsage();
  
  return context;
};
