
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
  isLoading: false,
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

  // Efeito para configurar o listener de autenticação do Supabase
  useEffect(() => {
    // Primeiro configurar o listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            // Buscar dados do perfil do usuário
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            // Mapear o usuário do Supabase para nosso formato
            const mappedUser = mapSupabaseUser(session.user, profileData);
            setCurrentUser(mappedUser);
          } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
            // Mesmo sem perfil, podemos usar os dados básicos do usuário
            const mappedUser = mapSupabaseUser(session.user);
            setCurrentUser(mappedUser);
          }
        } else {
          setCurrentUser(null);
        }
      }
    );

    // Em seguida, verificar se já existe uma sessão ativa
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        try {
          // Buscar dados do perfil do usuário
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          // Mapear o usuário do Supabase para nosso formato
          const mappedUser = mapSupabaseUser(session.user, profileData);
          setCurrentUser(mappedUser);
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          // Mesmo sem perfil, podemos usar os dados básicos do usuário
          const mappedUser = mapSupabaseUser(session.user);
          setCurrentUser(mappedUser);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // O listener onAuthStateChange irá atualizar o estado do usuário
      return true;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao fazer login",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Criar usuário no Supabase Auth
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
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // O perfil será criado automaticamente pelo trigger SQL
      toast({
        title: "Conta criada com sucesso",
        description: "Sua conta foi criada e você foi autenticado automaticamente."
      });
      
      // O listener onAuthStateChange irá atualizar o estado do usuário
      return true;
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao criar sua conta",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setCurrentUser(null);
      setSession(null);
    }
  };
  
  // Valor do contexto
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
