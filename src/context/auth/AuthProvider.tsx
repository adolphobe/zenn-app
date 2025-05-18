
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../../types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { AuthContextType } from './types';
import { login as authLogin, signup as authSignup, sendPasswordResetEmail as authSendPasswordResetEmail, 
  fetchUserProfile, checkAuthSession } from './authService';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] Inicializando estado de autenticação");
    console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Verificando se existe uma sessão ativa");
    
    // Check for logout in progress flag and clear it if it exists on page load
    const logoutInProgress = localStorage.getItem('logout_in_progress');
    if (logoutInProgress === 'true') {
      console.log("[AuthProvider] Detectada flag de logout em andamento ao inicializar, limpando");
      localStorage.removeItem('logout_in_progress');
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
    }
    
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    // Set up auth state change listener FIRST
    const setupAuthListener = () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("[AuthProvider] Estado de autenticação alterado:", event);
            console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Evento de autenticação detectado:", 
              event === 'SIGNED_IN' ? 'Usuário entrou' : 
              event === 'SIGNED_OUT' ? 'Usuário saiu' : 
              'Outro evento de autenticação');
            
            // Update session state
            setSession(newSession);
            
            if (event === 'SIGNED_OUT') {
              console.log("[AuthProvider] Usuário deslogado");
              console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Usuário encerrou a sessão");
              setCurrentUser(null);
              setIsLoading(false);
              return;
            }
            
            // Use setTimeout to prevent potential race conditions
            if (newSession?.user) {
              console.log("[AuthProvider] Nova sessão detectada");
              console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Iniciando nova sessão para o usuário");
              
              // Use setTimeout to avoid race conditions
              setTimeout(() => {
                fetchUserProfile(newSession.user)
                  .then(user => {
                    setCurrentUser(user);
                    setIsLoading(false);
                    setAuthInitialized(true);
                  });
              }, 0);
            }
          }
        );
        
        authSubscription = subscription;
        return true;
      } catch (error) {
        console.error("[AuthProvider] Erro ao configurar listener de autenticação:", error);
        return false;
      }
    };
    
    // First set up the auth listener
    const listenerSetup = setupAuthListener();
    
    if (!listenerSetup) {
      console.error("[AuthProvider] Falha ao configurar listener de autenticação, tentando recuperar sessão existente");
      setIsLoading(false);
    }
    
    // THEN check for existing session
    const checkInitialSession = async () => {
      try {
        console.log("[AuthProvider] Verificando sessão inicial...");
        
        const { isAuthenticated, session, user, error } = await checkAuthSession();
        
        if (error) {
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        console.log("[AuthProvider] Verificação inicial da sessão:", isAuthenticated ? "Sessão encontrada" : "Nenhuma sessão");
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS:", isAuthenticated ? "Encontramos uma sessão ativa" : "Nenhuma sessão ativa encontrada");
        
        if (isAuthenticated && session && user) {
          setSession(session);
          setCurrentUser(user);
        } 
        
        // Always update loading state regardless of auth status
        setIsLoading(false);
        setAuthInitialized(true);
      } catch (error) {
        console.error("[AuthProvider] Erro ao verificar sessão:", error);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro ao verificar se existe uma sessão ativa");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };
    
    // Check for initial session after setting up the listener
    setTimeout(() => {
      checkInitialSession();
    }, 10); // Small delay to ensure listener is registered first
    
    // Clean up subscription on unmount
    return () => {
      console.log("[AuthProvider] Limpando - cancelando inscrição em eventos de autenticação");
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean, error?: any }> => {
    setIsLoading(true);
    
    try {
      const result = await authLogin(email, password);
      
      if (result.success && result.user && result.session) {
        // The session will be updated by the auth state change listener
        // But we can update the user state directly
        setSession(result.session);
        const user = await fetchUserProfile(result.user);
        setCurrentUser(user);
      }
      
      setIsLoading(false);
      return { success: result.success, error: result.error };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error };
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: any }> => {
    return await authSendPasswordResetEmail(email);
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await authSignup(email, password, name);
      
      if (result.success && result.user && result.session) {
        // The session will be updated by the auth state change listener
        // But we can update the user state directly
        setSession(result.session);
        const user = await fetchUserProfile(result.user);
        setCurrentUser(user);
      }
      
      setIsLoading(false);
      return result.success;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    console.log("[AuthProvider] Iniciando processo completo de logout do usuário");
    console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Iniciando processo completo de logout no sistema");
    
    setIsLoading(true);
    
    try {
      // First clear local states 
      setCurrentUser(null);
      setSession(null);
      
      // Remove any locally stored auth data
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      // Call Supabase signOut with explicit scope to ensure all devices are logged out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("[AuthProvider] Erro no logout:", error.message);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Erro ao tentar encerrar a sessão:", error.message);
        
        const errorDetails = processAuthError(error);
        
        toast({
          title: "Falha no logout",
          description: errorDetails.message,
          variant: "destructive"
        });
      } else {
        console.log("[AuthProvider] Usuário deslogado com sucesso");
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Sessão encerrada com sucesso");
        
        toast({
          title: "Logout realizado",
          description: "Você saiu com sucesso",
        });
      }
    } catch (error) {
      console.error("[AuthProvider] Erro durante logout:", error);
      console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao tentar encerrar a sessão");
      
      const errorDetails = processAuthError(error);
    } finally {
      // Always clear user states and session when logging out
      setCurrentUser(null);
      setSession(null);
      setIsLoading(false);
    }
  };
  
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
