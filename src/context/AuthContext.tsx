
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';

// Type definitions for the auth context
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, error?: any }>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean, error?: any }>;
}

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

// Map Supabase user to our app's user format
const mapSupabaseUser = (user: any, profileData?: any): User => {
  return {
    id: user.id,
    name: profileData?.full_name || user.user_metadata?.name || '',
    email: user.email || '',
    profileImage: profileData?.avatar_url || user.user_metadata?.avatar_url || '',
    lastLoginAt: new Date().toISOString(),
    createdAt: user.created_at || new Date().toISOString(),
    preferences: {
      darkMode: false,
      activeViewMode: 'power',
      sidebarOpen: true,
      viewModeSettings: {
        power: {
          showHiddenTasks: false,
          showPillars: true,
          showDates: true,
          showScores: true,
          sortOptions: {
            sortDirection: 'desc',
            noDateAtEnd: true
          }
        },
        chronological: {
          showHiddenTasks: false,
          showPillars: true,
          showDates: true,
          showScores: true,
          sortOptions: {
            sortDirection: 'asc',
            noDateAtEnd: true
          }
        }
      },
      dateDisplayOptions: {
        hideYear: false,
        hideTime: false,
        hideDate: false
      }
    },
    password: ''
  };
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] Inicializando estado de autenticação");
    console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Verificando se existe uma sessão ativa");
    
    // Check for logout in progress flag and clear it if it exists on page load
    // This handles cases where the page was refreshed during logout
    const logoutInProgress = localStorage.getItem('logout_in_progress');
    if (logoutInProgress === 'true') {
      console.log("[AuthProvider] Detectada flag de logout em andamento ao inicializar, limpando");
      localStorage.removeItem('logout_in_progress');
    }
    
    // Helper function to fetch user profile
    const fetchUserProfile = async (user: any) => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        const mappedUser = mapSupabaseUser(user, profileData);
        console.log("[AuthProvider] Perfil do usuário carregado:", mappedUser.email);
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Perfil do usuário carregado com sucesso");
        setCurrentUser(mappedUser);
      } catch (error) {
        console.error("[AuthProvider] Erro ao buscar perfil do usuário:", error);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro ao carregar os dados do perfil do usuário");
        const mappedUser = mapSupabaseUser(user);
        setCurrentUser(mappedUser);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state change listener FIRST
    // IMPORTANT: We set this up before checking for an existing session to ensure we don't miss any auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("[AuthProvider] Estado de autenticação alterado:", event);
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Evento de autenticação detectado:", 
          event === 'SIGNED_IN' ? 'Usuário entrou' : 
          event === 'SIGNED_OUT' ? 'Usuário saiu' : 
          'Outro evento de autenticação');
        
        // Use synchronous state updates here
        setSession(newSession);
        
        if (event === 'SIGNED_OUT') {
          console.log("[AuthProvider] Usuário deslogado");
          console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Usuário encerrou a sessão");
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }
        
        // Use setTimeout for any Supabase calls to prevent potential race conditions/deadlocks
        if (newSession?.user) {
          console.log("[AuthProvider] Nova sessão detectada");
          console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Iniciando nova sessão para o usuário");
          
          setTimeout(() => {
            fetchUserProfile(newSession.user);
          }, 0);
        }
      }
    );
    
    // THEN check for existing session
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[AuthProvider] Verificação inicial da sessão:", data.session ? "Sessão encontrada" : "Nenhuma sessão");
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS:", data.session ? "Encontramos uma sessão ativa" : "Nenhuma sessão ativa encontrada");
        
        if (data.session) {
          setSession(data.session);
          // Fetch user profile data
          fetchUserProfile(data.session.user);
        } else {
          // No session found, mark as not loading
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Erro ao verificar sessão:", error);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro ao verificar se existe uma sessão ativa");
        setIsLoading(false);
      }
    };
    
    // Check for initial session after setting up the listener
    checkInitialSession();
    
    // Clean up subscription on unmount
    return () => {
      console.log("[AuthProvider] Limpando - cancelando inscrição em eventos de autenticação");
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Desativando monitoramento de eventos de autenticação");
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean, error?: any }> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Tentando login com email:", email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Tentando fazer login com o email:", email);
      
      // Enhanced login with explicit storage options
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("[AuthProvider] Erro de login:", error.message);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Falha ao fazer login. Erro:", error.message);
        
        const errorDetails = processAuthError(error);
        
        toast({
          title: "Falha no login",
          description: errorDetails.message,
          variant: "destructive"
        });
        
        setIsLoading(false);
        return { success: false, error };
      }
      
      console.log("[AuthProvider] Login bem-sucedido:", data.user?.email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Login realizado com sucesso");
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("[AuthProvider] Erro de login:", error);
      console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante o processo de login");
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Erro no login",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return { success: false, error };
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: any }> => {
    try {
      console.log("[AuthProvider] Solicitando redefinição de senha para:", email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Enviando email de recuperação de senha");
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error("[AuthProvider] Erro ao enviar email de recuperação:", error);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Não foi possível enviar o email de recuperação de senha");
        
        const errorDetails = processAuthError(error);
        
        toast({
          title: "Erro na recuperação de senha",
          description: errorDetails.message,
          variant: "destructive"
        });
        
        return { success: false, error };
      }
      
      console.log("[AuthProvider] Email de recuperação enviado para:", email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Email de recuperação de senha enviado com sucesso");
      
      toast({
        title: "Email enviado",
        description: `Verifique sua caixa de entrada em ${email}`,
      });
      
      return { success: true };
    } catch (error) {
      console.error("[AuthProvider] Erro ao enviar email de recuperação:", error);
      console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao tentar enviar o email");
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Erro na recuperação de senha",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      return { success: false, error };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Tentando criar conta com email:", email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Iniciando processo de criação de conta");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error("[AuthProvider] Erro no cadastro:", error.message);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Falha ao criar nova conta. Erro:", error.message);
        
        const errorDetails = processAuthError(error);
        
        toast({
          title: "Falha na criação da conta",
          description: errorDetails.message,
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error("[AuthProvider] Usuário já existe");
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Este email já está registrado no sistema");
        
        toast({
          title: "Falha na criação da conta",
          description: "Este email já está registrado.",
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      // Check if email confirmation is required
      if (data?.user && data.session) {
        console.log("[AuthProvider] Conta criada e autenticada automaticamente");
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Conta criada com sucesso e login efetuado automaticamente");
        
        // Set session and user data immediately
        setSession(data.session);
        const mappedUser = mapSupabaseUser(data.user, null);
        setCurrentUser(mappedUser);
        
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      } else if (data?.user) {
        console.log("[AuthProvider] Confirmação de email necessária");
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Conta criada. É necessário confirmar o email antes de fazer login");
        
        toast({
          title: "Conta criada com sucesso",
          description: "Um email de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu email para entrar.",
        });
        
        setIsLoading(false);
      }
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Erro no cadastro:", error);
      console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante a criação da conta");
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Falha na criação da conta",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function - Use the centralized function in authUtils.ts
  const logout = async (): Promise<void> => {
    // We'll still use this function but delegate to the centralized one
    // This keeps backward compatibility with existing code that calls auth.logout()
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
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    signup,
    logout,
    session,
    sendPasswordResetEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
