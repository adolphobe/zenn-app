
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Tipo para o contexto de autenticação
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
}

// Criar contexto
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  session: null,
});

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Função para converter usuário do Supabase para o formato do nosso app
const mapSupabaseUser = (user: SupabaseUser, profileData?: any): User => {
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
    // Não temos senha no objeto de usuário do Supabase
    password: ''
  };
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        setSession(newSession);
        
        if (newSession?.user) {
          // Deferred API call to prevent blocking the auth flow
          setTimeout(async () => {
            try {
              // Fetch user profile data
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .maybeSingle();
              
              const mappedUser = mapSupabaseUser(newSession.user, profileData);
              console.log("User mapped:", mappedUser.email);
              setCurrentUser(mappedUser);
            } catch (error) {
              console.error("Error fetching user profile:", error);
              const mappedUser = mapSupabaseUser(newSession.user);
              setCurrentUser(mappedUser);
            }
          }, 0);
        } else {
          setCurrentUser(null);
        }
      }
    );
    
    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Initial session check:", existingSession ? "Session found" : "No session");
      setSession(existingSession);
      
      if (existingSession?.user) {
        // Deferred API call to prevent blocking the auth flow
        setTimeout(async () => {
          try {
            // Fetch user profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', existingSession.user.id)
              .maybeSingle();
            
            const mappedUser = mapSupabaseUser(existingSession.user, profileData);
            console.log("Initial user mapped:", mappedUser.email);
            setCurrentUser(mappedUser);
          } catch (error) {
            console.error("Error fetching initial user profile:", error);
            const mappedUser = mapSupabaseUser(existingSession.user);
            setCurrentUser(mappedUser);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      console.log("AuthProvider: Cleanup - unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        
        throw error;
      }
      
      console.log("Login successful:", data.user?.email);
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso",
      });
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting to create account with email:", email);
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
        console.error("Signup error:", error.message);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error("User already exists");
        toast({
          title: "Erro ao criar conta",
          description: "Este e-mail já está registrado.",
          variant: "destructive"
        });
        throw new Error("user_already_exists");
      }
      
      // Check if email confirmation is required
      if (data?.user && !data.session) {
        console.log("Email confirmation required");
        toast({
          title: "Conta criada com sucesso",
          description: "Um e-mail de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu e-mail para fazer login.",
        });
      } else {
        console.log("Account created and automatically authenticated");
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      if (!error.message) {
        error.message = "Ocorreu um erro ao criar sua conta";
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    console.log("Logging out user");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error.message);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setCurrentUser(null);
      setSession(null);
      console.log("User logged out successfully");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    }
  };
  
  // Value provided by the context
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
