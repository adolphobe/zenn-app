import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
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

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] Inicializando estado de autenticação");
    
    // Configurar o listener de autenticação que será executado quando o status mudar 
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("[AuthProvider] Estado de autenticação alterado:", event, newSession?.user?.email || "Sem usuário");
        
        setSession(newSession);
        
        if (newSession?.user) {
          // Carregar dados do usuário da tabela profiles (não bloqueia)
          const loadUserProfile = async () => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user!.id)
                .maybeSingle();
                
              const mappedUser = mapSupabaseUser(newSession.user, profileData);
              console.log("[AuthProvider] Perfil do usuário carregado:", mappedUser.email);
              setCurrentUser(mappedUser);
            } catch (error) {
              console.error("[AuthProvider] Erro ao buscar perfil do usuário:", error);
              const mappedUser = mapSupabaseUser(newSession.user);
              setCurrentUser(mappedUser);
            }
          };
          
          // Desacoplar operações assíncronas 
          setTimeout(loadUserProfile, 0);
          
        } else if (event === 'SIGNED_OUT') {
          console.log("[AuthProvider] Usuário desconectado");
          setCurrentUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Verificar sessão ativa imediatamente
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[AuthProvider] Verificação inicial de sessão:", data.session ? "Sessão encontrada" : "Sem sessão");
      } catch (error) {
        console.error("[AuthProvider] Erro ao verificar sessão:", error);
      }
    };
    
    checkSession();
    
    return () => {
      console.log("[AuthProvider] Limpeza - cancelando inscrição");
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Tentando login com email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("[AuthProvider] Erro de login:", error.message);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log("[AuthProvider] Login bem-sucedido:", data.user?.email);
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso",
      });
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Erro de login:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Cadastro
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Tentando criar conta com email:", email);
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
        console.error("[AuthProvider] Erro de cadastro:", error.message);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error("[AuthProvider] Usuário já existe");
        toast({
          title: "Erro ao criar conta",
          description: "Este e-mail já está registrado.",
          variant: "destructive"
        });
        return false;
      }
      
      // Verifica se é necessária confirmação por email
      if (data?.user && !data.session) {
        console.log("[AuthProvider] Confirmação de email necessária");
        toast({
          title: "Conta criada com sucesso",
          description: "Um e-mail de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu e-mail para fazer login.",
        });
      } else {
        console.log("[AuthProvider] Conta criada e autenticada automaticamente");
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Erro de cadastro:", error);
      if (!error.message) {
        error.message = "Ocorreu um erro ao criar sua conta";
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async (): Promise<void> => {
    console.log("[AuthProvider] Desconectando usuário");
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[AuthProvider] Erro ao desconectar:", error.message);
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setCurrentUser(null);
        setSession(null);
        console.log("[AuthProvider] Usuário desconectado com sucesso");
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
      }
    } catch (error) {
      console.error("[AuthProvider] Erro durante logout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Value provided by the context - simplificado e mais direto
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
