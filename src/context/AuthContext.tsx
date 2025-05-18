import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Type definitions for the auth context
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  session: null,
});

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Additional logging for each consumer of the auth context
  const callerComponent = new Error().stack?.split('\n')[2]?.trim() || 'Unknown Component';
  console.log(`[useAuth] Contexto de autenticação acessado por: ${callerComponent}`);
  console.log(`[useAuth] Estado atual:`, { 
    isAuthenticated: context.isAuthenticated, 
    isLoading: context.isLoading,
    hasUser: !!context.currentUser, 
    hasSession: !!context.session,
    userId: context.currentUser?.id || 'nenhum'
  });
  
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
  const [authState, setAuthState] = useState<string>("INITIALIZING");

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] INICIANDO PROVIDER DE AUTENTICAÇÃO");
    console.log("[AuthProvider] SEQUÊNCIA DE OPERAÇÕES: Inicializando estado -> Verificando sessão inicial -> Configurando listener de mudanças");
    setAuthState("INITIALIZING");
    
    let unmounted = false;
    
    // Helper function to fetch user profile
    const fetchUserProfile = async (user: any) => {
      if (unmounted) return;
      
      try {
        console.log("[AuthProvider] Buscando perfil do usuário:", user.email);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (unmounted) return;
        
        const mappedUser = mapSupabaseUser(user, profileData);
        console.log("[AuthProvider] Perfil do usuário carregado com sucesso:", mappedUser.email);
        setCurrentUser(mappedUser);
      } catch (error) {
        console.error("[AuthProvider] Erro ao buscar perfil do usuário:", error);
        if (unmounted) return;
        
        const mappedUser = mapSupabaseUser(user);
        setCurrentUser(mappedUser);
      } finally {
        if (!unmounted) {
          setIsLoading(false);
          setAuthState("COMPLETED_PROFILE_FETCH");
        }
      }
    };
    
    // First set up auth state change listener
    console.log("[AuthProvider] Configurando listener de mudanças de autenticação");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (unmounted) return;
        
        const prevAuthState = authState;
        setAuthState(`AUTH_STATE_CHANGE: ${event}`);
        
        console.log(`[AuthProvider] Evento de autenticação: ${event}`, {
          prevState: prevAuthState,
          hasSession: !!newSession,
          timestamp: new Date().toISOString()
        });
        
        if (event === 'SIGNED_OUT') {
          console.log("[AuthProvider] Evento de logout detectado - limpando estados");
          setSession(null);
          setCurrentUser(null);
          setIsLoading(false);
          setAuthState("SIGNED_OUT");
          return;
        }
        
        if (newSession?.user) {
          console.log(`[AuthProvider] Nova sessão detectada para: ${newSession.user.email}`);
          setSession(newSession);
          // Fetch user profile using the helper
          fetchUserProfile(newSession.user);
        }
      }
    );
    
    // Then check for existing session to set initial state
    const checkInitialSession = async () => {
      try {
        console.log("[AuthProvider] Verificando sessão inicial");
        setAuthState("CHECKING_INITIAL_SESSION");
        
        const { data } = await supabase.auth.getSession();
        
        if (unmounted) return;
        
        console.log("[AuthProvider] Sessão inicial verificada:", data.session ? "ENCONTRADA" : "NÃO ENCONTRADA");
        
        if (data.session) {
          setSession(data.session);
          setAuthState("FOUND_INITIAL_SESSION");
          
          // Log detailed session info
          console.log("[AuthProvider] DETALHES DA SESSÃO:", {
            userId: data.session.user.id,
            email: data.session.user.email,
            expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : 'N/A',
            provider: data.session.user.app_metadata?.provider || 'unknown',
          });
          
          // Fetch user profile data
          fetchUserProfile(data.session.user);
        } else {
          // No session found, mark as not loading
          setAuthState("NO_INITIAL_SESSION");
          setIsLoading(false);
          // Double check localStorage for tokens to detect any inconsistencies
          const hasToken = !!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
          if (hasToken) {
            console.warn("[AuthProvider] ALERTA DE INCONSISTÊNCIA: Token encontrado no localStorage, mas nenhuma sessão foi recuperada!");
          }
        }
      } catch (error) {
        console.error("[AuthProvider] Erro ao verificar sessão inicial:", error);
        if (!unmounted) {
          setAuthState("ERROR_CHECKING_SESSION");
          setIsLoading(false);
        }
      }
    };
    
    // Check initial session
    checkInitialSession();
    
    // Clean up subscription on unmount
    return () => {
      unmounted = true;
      console.log("[AuthProvider] Limpando componente AuthProvider - cancelando inscrição em eventos");
      subscription.unsubscribe();
    };
  }, [authState]); // Add authState to dependencies to avoid stale state in logs

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Tentando login com email:", email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Tentando fazer login com o email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("[AuthProvider] Erro de login:", error.message);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Falha ao fazer login. Erro:", error.message);
        
        // Show more user-friendly error messages
        let errorMessage = "Falha no login. Verifique suas credenciais.";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Usuário não encontrado ou senha incorreta. Por favor, tente novamente.";
        }
        
        toast({
          title: "Falha no login",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log("[AuthProvider] Login bem-sucedido:", data.user?.email);
      console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Login realizado com sucesso");
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Erro de login:", error);
      console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante o processo de login");
      
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
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
        
        toast({
          title: "Falha na criação da conta",
          description: error.message,
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
      
      toast({
        title: "Falha na criação da conta",
        description: error.message || "Ocorreu um erro inesperado ao criar sua conta",
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function - Enhanced to ensure complete session removal
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
      
      // Call Supabase signOut and wait for it to complete
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("[AuthProvider] Erro no logout:", error.message);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Erro ao tentar encerrar a sessão:", error.message);
        
        toast({
          title: "Falha no logout",
          description: error.message,
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
    } finally {
      // Always clear user states and session when logging out
      setCurrentUser(null);
      setSession(null);
      setIsLoading(false);
    }
  };
  
  // Log any changes to key state variables
  useEffect(() => {
    console.log("[AuthProvider] Estado de autenticação alterado:", { 
      isAuthenticated: !!session?.user,
      hasUser: !!currentUser,
      isLoading,
      authStateLabel: authState,
      timestamp: new Date().toISOString()
    });
  }, [session, currentUser, isLoading, authState]);
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    signup,
    logout,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
