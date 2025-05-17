
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
    console.log('[AUTH] Inicializando provider de autenticação');
    let mounted = true;
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log(`[AUTH] Evento de autenticação: ${event} para ${newSession?.user?.email || 'usuário desconhecido'}`);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          if (newSession?.user) {
            // Update user synchronously to avoid race conditions
            console.log(`[AUTH] Usuário autenticado: ${newSession.user.email}`);
            
            // Fetch profile data non-blocking
            supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle()
              .then(({ data: profileData }) => {
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user, profileData);
                  console.log(`[AUTH] Perfil do usuário carregado: ${mappedUser.email}`);
                  setCurrentUser(mappedUser);
                }
              })
              .catch((error) => {
                console.error(`[AUTH] Erro ao buscar perfil: ${error.message}`);
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user);
                  setCurrentUser(mappedUser);
                }
              });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[AUTH] Usuário desconectado');
          setSession(null);
          setCurrentUser(null);
        }
      }
    );
    
    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log(`[AUTH] Verificação inicial de sessão: ${existingSession ? "Sessão encontrada" : "Sem sessão"}`);
      
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
              console.log(`[AUTH] Usuário inicial mapeado: ${mappedUser.email}`);
              setCurrentUser(mappedUser);
            }
          })
          .catch((error) => {
            console.error(`[AUTH] Erro ao buscar perfil inicial: ${error.message}`);
            if (mounted) {
              const mappedUser = mapSupabaseUser(existingSession.user);
              setCurrentUser(mappedUser);
            }
          })
          .finally(() => {
            if (mounted) {
              // Mark auth as initialized and not loading anymore
              setIsLoading(false);
              setAuthInitialized(true);
              console.log('[AUTH] Autenticação inicializada com sessão existente');
            }
          });
      } else {
        // If no session, just mark as initialized
        setIsLoading(false);
        setAuthInitialized(true);
        console.log('[AUTH] Sem sessão inicial, autenticação inicializada');
      }
    }).catch((error) => {
      console.error(`[AUTH] Erro ao verificar sessão: ${error.message}`);
      if (mounted) {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    });
    
    return () => {
      console.log('[AUTH] Limpando - desinscrição de mudanças de estado de autenticação');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`[AUTH] Tentando login com email: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error(`[AUTH] Erro de login: ${error.message}`);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        
        return false; // Return false instead of throwing
      }
      
      console.log(`[AUTH] Login bem-sucedido: ${data.user?.email}`);
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso",
      });
      
      return true;
    } catch (error: any) {
      console.error("[AUTH] Login error:", error);
      return false; // Return false on exception
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`[AUTH] Tentando criar conta com email: ${email}`);
    
    try {
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
        console.error(`[AUTH] Erro ao criar conta: ${error.message}`);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return false; // Return false instead of throwing
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error('[AUTH] Usuário já existe');
        toast({
          title: "Erro ao criar conta",
          description: "Este e-mail já está registrado.",
          variant: "destructive"
        });
        return false; // Return false instead of throwing
      }
      
      // Check if email confirmation is required
      if (data?.user && !data.session) {
        console.log('[AUTH] Confirmação de email necessária');
        toast({
          title: "Conta criada com sucesso",
          description: "Um e-mail de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu e-mail para fazer login.",
        });
      } else {
        console.log('[AUTH] Conta criada e autenticada automaticamente');
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("[AUTH] Signup error:", error);
      return false; // Return false on exception
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async (): Promise<void> => {
    console.log('[AUTH] Desconectando usuário');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error(`[AUTH] Erro ao fazer logout: ${error.message}`);
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive"
        });
        // Don't use .catch here since we're already in a try/catch
        throw error;
      } else {
        setCurrentUser(null);
        setSession(null);
        console.log('[AUTH] Usuário desconectado com sucesso');
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
      }
    } catch (error: any) {
      console.error("[AUTH] Error during logout:", error);
      // Don't use .catch here since we're already in a try/catch
      throw error;
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
