
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

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] Initializing auth state");
    
    // First check for existing session to set initial state
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[AuthProvider] Initial session check:", data.session ? "Session found" : "No session");
        
        if (data.session) {
          setSession(data.session);
          // Fetch user profile data
          fetchUserProfile(data.session.user);
        } else {
          // No session found, mark as not loading
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    // Helper function to fetch user profile
    const fetchUserProfile = async (user: any) => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        const mappedUser = mapSupabaseUser(user, profileData);
        console.log("[AuthProvider] User profile loaded:", mappedUser.email);
        setCurrentUser(mappedUser);
      } catch (error) {
        console.error("[AuthProvider] Error fetching user profile:", error);
        const mappedUser = mapSupabaseUser(user);
        setCurrentUser(mappedUser);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check initial session
    checkInitialSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("[AuthProvider] Auth state changed:", event);
        
        if (event === 'SIGNED_OUT') {
          console.log("[AuthProvider] User signed out");
          setSession(null);
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }
        
        if (newSession?.user) {
          console.log("[AuthProvider] New session detected");
          setSession(newSession);
          // Fetch user profile using the helper
          fetchUserProfile(newSession.user);
        }
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      console.log("[AuthProvider] Cleaning up - unsubscribing from auth events");
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("[AuthProvider] Login error:", error.message);
        
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
      
      console.log("[AuthProvider] Login successful:", data.user?.email);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Login error:", error);
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
      console.log("[AuthProvider] Attempting to create account with email:", email);
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
        console.error("[AuthProvider] Signup error:", error.message);
        toast({
          title: "Falha na criação da conta",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error("[AuthProvider] User already exists");
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
        console.log("[AuthProvider] Account created and authenticated automatically");
        
        // Set session and user data immediately
        setSession(data.session);
        const mappedUser = mapSupabaseUser(data.user, null);
        setCurrentUser(mappedUser);
        
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      } else if (data?.user) {
        console.log("[AuthProvider] Email confirmation required");
        toast({
          title: "Conta criada com sucesso",
          description: "Um email de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu email para entrar.",
        });
        setIsLoading(false);
      }
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Signup error:", error);
      toast({
        title: "Falha na criação da conta",
        description: error.message || "Ocorreu um erro inesperado ao criar sua conta",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    console.log("[AuthProvider] Logging out user");
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[AuthProvider] Logout error:", error.message);
        toast({
          title: "Falha no logout",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("[AuthProvider] User logged out successfully");
        toast({
          title: "Logout realizado",
          description: "Você saiu com sucesso",
        });
      }
    } catch (error) {
      console.error("[AuthProvider] Error during logout:", error);
    } finally {
      // Always clear user and session state on logout attempt
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
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
