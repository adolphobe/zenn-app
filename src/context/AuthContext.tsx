
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

  // Function to show visual alert on screen
  const showAlert = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '80%';
    alertDiv.style.wordBreak = 'break-word';
    
    // Set color based on type
    if (type === 'info') {
      alertDiv.style.backgroundColor = '#3b82f6';
    } else if (type === 'success') {
      alertDiv.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
      alertDiv.style.backgroundColor = '#ef4444';
    }
    
    alertDiv.style.color = 'white';
    alertDiv.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alertDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 500);
    }, 5000);
  };

  useEffect(() => {
    showAlert('AuthProvider: Inicializando autenticação', 'info');
    let mounted = true;
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        showAlert(`Auth state changed: ${event} for ${newSession?.user?.email || 'unknown user'}`, 'info');
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          if (newSession?.user) {
            // Update user synchronously to avoid race conditions
            showAlert(`Usuário autenticado: ${newSession.user.email}`, 'success');
            
            // Fetch profile data non-blocking
            supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle()
              .then(({ data: profileData }) => {
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user, profileData);
                  showAlert(`Perfil do usuário carregado: ${mappedUser.email}`, 'success');
                  setCurrentUser(mappedUser);
                }
              })
              .catch((error: Error) => {
                showAlert(`Erro ao buscar perfil: ${error.message}`, 'error');
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user);
                  setCurrentUser(mappedUser);
                }
              });
          }
        } else if (event === 'SIGNED_OUT') {
          showAlert('Usuário desconectado', 'info');
          setSession(null);
          setCurrentUser(null);
        }
      }
    );
    
    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      showAlert(`Verificação inicial de sessão: ${existingSession ? "Sessão encontrada" : "Sem sessão"}`, 'info');
      
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
              showAlert(`Usuário inicial mapeado: ${mappedUser.email}`, 'success');
              setCurrentUser(mappedUser);
            }
          })
          .catch((error: Error) => {
            showAlert(`Erro ao buscar perfil inicial: ${error.message}`, 'error');
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
              showAlert('Autenticação inicializada', 'success');
            }
          });
      } else {
        // If no session, just mark as initialized
        setIsLoading(false);
        setAuthInitialized(true);
        showAlert('Sem sessão inicial, autenticação inicializada', 'info');
      }
    }).catch((error: Error) => {
      showAlert(`Erro ao verificar sessão: ${error.message}`, 'error');
      if (mounted) {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    });
    
    return () => {
      showAlert('AuthProvider: Limpando - desinscrição de mudanças de estado de autenticação', 'info');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    showAlert(`Tentando login com email: ${email}`, 'info');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        showAlert(`Erro de login: ${error.message}`, 'error');
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        
        return false; // Return false instead of throwing
      }
      
      showAlert(`Login bem-sucedido: ${data.user?.email}`, 'success');
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso",
      });
      
      return true;
    } catch (error: any) {
      showAlert(`Erro de login: ${error.message}`, 'error');
      console.error("Login error:", error);
      return false; // Return false on exception
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    showAlert(`Tentando criar conta com email: ${email}`, 'info');
    
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
        showAlert(`Erro ao criar conta: ${error.message}`, 'error');
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return false; // Return false instead of throwing
      }
      
      if (data?.user?.identities?.length === 0) {
        showAlert('Usuário já existe', 'error');
        toast({
          title: "Erro ao criar conta",
          description: "Este e-mail já está registrado.",
          variant: "destructive"
        });
        return false; // Return false instead of throwing
      }
      
      // Check if email confirmation is required
      if (data?.user && !data.session) {
        showAlert('Confirmação de email necessária', 'info');
        toast({
          title: "Conta criada com sucesso",
          description: "Um e-mail de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu e-mail para fazer login.",
        });
      } else {
        showAlert('Conta criada e autenticada automaticamente', 'success');
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      }
      
      return true;
    } catch (error: any) {
      showAlert(`Erro ao criar conta: ${error.message || 'Erro desconhecido'}`, 'error');
      console.error("Signup error:", error);
      return false; // Return false on exception
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async (): Promise<void> => {
    showAlert('Desconectando usuário', 'info');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        showAlert(`Erro ao fazer logout: ${error.message}`, 'error');
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive"
        });
        return Promise.reject(error); // Return rejected promise
      } else {
        setCurrentUser(null);
        setSession(null);
        showAlert('Usuário desconectado com sucesso', 'success');
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
      }
    } catch (error: any) {
      showAlert(`Erro durante logout: ${error.message || 'Erro desconhecido'}`, 'error');
      console.error("Error during logout:", error);
      return Promise.reject(error); // Return rejected promise
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
