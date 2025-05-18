
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
  const instanceId = Math.random().toString(36).substring(2, 7);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log(`[AuthProvider:${instanceId}] INICIANDO PROVIDER DE AUTENTICAÇÃO`);
    console.log(`[AuthProvider:${instanceId}] Estado atual: ${authState}`);

    let unmounted = false;
    
    // Helper function to fetch user profile
    const fetchUserProfile = async (user: any) => {
      if (unmounted) return;
      
      try {
        console.log(`[AuthProvider:${instanceId}] Buscando perfil do usuário: ${user.email}`);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (unmounted) return;
        
        const mappedUser = mapSupabaseUser(user, profileData);
        console.log(`[AuthProvider:${instanceId}] Perfil do usuário carregado: ${user.email}`);
        setCurrentUser(mappedUser);
        setIsLoading(false);
        setAuthState("COMPLETED_PROFILE_FETCH");
      } catch (error) {
        console.error(`[AuthProvider:${instanceId}] Erro ao buscar perfil:`, error);
        if (unmounted) return;
        
        const mappedUser = mapSupabaseUser(user);
        setCurrentUser(mappedUser);
        setIsLoading(false);
        setAuthState("ERROR_PROFILE_FETCH");
      }
    };
    
    // First set up auth state change listener
    console.log(`[AuthProvider:${instanceId}] Configurando listener de autenticação`);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (unmounted) return;
        
        console.log(`[AuthProvider:${instanceId}] Evento de autenticação: ${event}`, {
          hasSession: !!newSession,
          timestamp: new Date().toISOString()
        });
        
        if (event === 'SIGNED_OUT') {
          console.log(`[AuthProvider:${instanceId}] Evento de logout detectado`);
          setSession(null);
          setCurrentUser(null);
          setIsLoading(false);
          setAuthState("SIGNED_OUT");
          return;
        }
        
        if (newSession?.user) {
          console.log(`[AuthProvider:${instanceId}] Nova sessão: ${newSession.user.email}`);
          setSession(newSession);
          
          // Simple limited timeout to break any potential loops
          setTimeout(() => {
            fetchUserProfile(newSession.user);
          }, 50);
        }
      }
    );
    
    // Then check for existing session to set initial state
    const checkInitialSession = async () => {
      try {
        console.log(`[AuthProvider:${instanceId}] Verificando sessão inicial`);
        
        const { data } = await supabase.auth.getSession();
        
        if (unmounted) return;
        
        if (data.session) {
          console.log(`[AuthProvider:${instanceId}] Sessão inicial encontrada: ${data.session.user.email}`);
          setSession(data.session);
          
          // Add a delay before fetching profile to avoid potential race conditions
          setTimeout(() => {
            if (!unmounted) {
              fetchUserProfile(data.session!.user);
            }
          }, 100);
        } else {
          console.log(`[AuthProvider:${instanceId}] Nenhuma sessão inicial encontrada`);
          setIsLoading(false);
          setAuthState("NO_INITIAL_SESSION");
        }
      } catch (error) {
        console.error(`[AuthProvider:${instanceId}] Erro ao verificar sessão:`, error);
        if (!unmounted) {
          setIsLoading(false);
          setAuthState("ERROR_CHECKING_SESSION");
        }
      }
    };
    
    // Check initial session with a slight delay to allow listener to set up
    setTimeout(() => {
      if (!unmounted) {
        checkInitialSession();
      }
    }, 50);
    
    // Clean up subscription on unmount
    return () => {
      unmounted = true;
      console.log(`[AuthProvider:${instanceId}] Limpando AuthProvider`);
      subscription.unsubscribe();
    };
  }, [authState, instanceId]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log(`[AuthProvider:${instanceId}] Tentando login: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error(`[AuthProvider:${instanceId}] Erro de login:`, error.message);
        
        toast({
          title: "Falha no login",
          description: "Usuário não encontrado ou senha incorreta. Por favor, tente novamente.",
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log(`[AuthProvider:${instanceId}] Login bem-sucedido: ${data.user?.email}`);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return true;
    } catch (error: any) {
      console.error(`[AuthProvider:${instanceId}] Erro inesperado:`, error);
      
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
      console.log(`[AuthProvider:${instanceId}] Tentando criar conta: ${email}`);
      
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
        console.error(`[AuthProvider:${instanceId}] Erro no cadastro:`, error.message);
        
        toast({
          title: "Falha na criação da conta",
          description: error.message,
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error(`[AuthProvider:${instanceId}] Usuário já existe`);
        
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
        console.log(`[AuthProvider:${instanceId}] Conta criada e autenticada`);
        
        // Set session and user data immediately
        setSession(data.session);
        const mappedUser = mapSupabaseUser(data.user, null);
        setCurrentUser(mappedUser);
        
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      } else if (data?.user) {
        console.log(`[AuthProvider:${instanceId}] Confirmação de email necessária`);
        
        toast({
          title: "Conta criada com sucesso",
          description: `Um email de confirmação foi enviado para ${email}. Por favor, verifique sua caixa de entrada.`,
        });
        
        setIsLoading(false);
      }
      
      return true;
    } catch (error: any) {
      console.error(`[AuthProvider:${instanceId}] Erro no cadastro:`, error);
      
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
    console.log(`[AuthProvider:${instanceId}] Iniciando logout`);
    
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
        console.error(`[AuthProvider:${instanceId}] Erro no logout:`, error.message);
        
        toast({
          title: "Falha no logout",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log(`[AuthProvider:${instanceId}] Logout bem-sucedido`);
        
        toast({
          title: "Logout realizado",
          description: "Você saiu com sucesso",
        });
      }
    } catch (error) {
      console.error(`[AuthProvider:${instanceId}] Erro durante logout:`, error);
    } finally {
      // Always clear user states and session when logging out
      setCurrentUser(null);
      setSession(null);
      setIsLoading(false);
      setAuthState("LOGGED_OUT");
    }
  };
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!session?.user && !!currentUser,
    isLoading,
    login,
    signup,
    logout,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
