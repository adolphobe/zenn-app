
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
    password: ''
  };
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    let mounted = true;
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          if (newSession?.user) {
            // Update user synchronously to avoid race conditions
            console.log("User signed in:", newSession.user.email);
            
            // Fetch profile data non-blocking
            supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle()
              .then(({ data: profileData }) => {
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user, profileData);
                  console.log("User profile loaded:", mappedUser.email);
                  setCurrentUser(mappedUser);
                }
              })
              .catch(error => {
                console.error("Error fetching user profile:", error);
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user);
                  setCurrentUser(mappedUser);
                }
              });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setSession(null);
          setCurrentUser(null);
        }
      }
    );
    
    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Initial session check:", existingSession ? "Session found" : "No session");
      
      if (!mounted) return;
      
      setSession(existingSession);
      
      if (existingSession?.user) {
        // If we have a session, get profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', existingSession.user.id)
          .maybeSingle()
          .then(({ data: profileData }) => {
            if (mounted) {
              const mappedUser = mapSupabaseUser(existingSession.user, profileData);
              console.log("Initial user mapped:", mappedUser.email);
              setCurrentUser(mappedUser);
            }
          })
          .catch(error => {
            console.error("Error fetching initial user profile:", error);
            if (mounted) {
              const mappedUser = mapSupabaseUser(existingSession.user);
              setCurrentUser(mappedUser);
            }
          });
      }
      
      // Mark auth as initialized and not loading anymore
      setIsLoading(false);
      setAuthInitialized(true);
    }).catch(error => {
      console.error("Error checking session:", error);
      if (mounted) {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    });
    
    return () => {
      console.log("AuthProvider: Cleanup - unsubscribing from auth state changes");
      mounted = false;
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
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error.message);
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      } else {
        setCurrentUser(null);
        setSession(null);
        console.log("User logged out successfully");
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Value provided by the context
  const value = {
    currentUser,
    isAuthenticated: !!session?.user,
    isLoading: isLoading || !authInitialized,
    login,
    signup,
    logout,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
