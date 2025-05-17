
import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { AuthContextType } from './types';
import { mapSupabaseUser } from './utils';

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

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('[AUTH:PROVIDER] Inicializando provider de autenticação');
    let mounted = true;
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log(`[AUTH:PROVIDER] Evento de autenticação: ${event} para ${newSession?.user?.email || 'usuário desconhecido'}`);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          if (newSession?.user) {
            console.log(`[AUTH:PROVIDER] Usuário autenticado: ${newSession.user.email}`);
            
            // Fetch profile data non-blocking
            supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle()
              .then(({ data: profileData }) => {
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user, profileData);
                  console.log(`[AUTH:PROVIDER] Perfil do usuário carregado: ${mappedUser.email}`);
                  setCurrentUser(mappedUser);
                }
              })
              .catch((error) => {
                console.error(`[AUTH:PROVIDER] Erro ao buscar perfil: ${error.message}`);
                if (mounted) {
                  const mappedUser = mapSupabaseUser(newSession.user);
                  setCurrentUser(mappedUser);
                }
              });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[AUTH:PROVIDER] Usuário desconectado');
          setSession(null);
          setCurrentUser(null);
        }
      }
    );
    
    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log(`[AUTH:PROVIDER] Verificação inicial de sessão: ${existingSession ? "Sessão encontrada" : "Sem sessão"}`);
      
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
              console.log(`[AUTH:PROVIDER] Usuário inicial mapeado: ${mappedUser.email}`);
              setCurrentUser(mappedUser);
              setIsLoading(false);
              setAuthInitialized(true);
            }
          })
          .catch((error) => {
            console.error(`[AUTH:PROVIDER] Erro ao buscar perfil inicial: ${error.message}`);
            if (mounted) {
              const mappedUser = mapSupabaseUser(existingSession.user);
              setCurrentUser(mappedUser);
              setIsLoading(false);
              setAuthInitialized(true);
            }
          });
      } else {
        // If no session, just mark as initialized
        setIsLoading(false);
        setAuthInitialized(true);
        console.log('[AUTH:PROVIDER] Sem sessão inicial, autenticação inicializada');
      }
    }).catch((error) => {
      console.error(`[AUTH:PROVIDER] Erro ao verificar sessão: ${error.message}`);
      if (mounted) {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    });
    
    return () => {
      console.log('[AUTH:PROVIDER] Limpando - desinscrição de mudanças de estado de autenticação');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`[AUTH:PROVIDER] Tentando login com email: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error(`[AUTH:PROVIDER] Erro de login: ${error.message}`);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        
        return false;
      }
      
      console.log(`[AUTH:PROVIDER] Login bem-sucedido: ${data.user?.email}`);
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso",
      });
      
      return true;
    } catch (error: any) {
      console.error("[AUTH:PROVIDER] Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`[AUTH:PROVIDER] Tentando criar conta com email: ${email}`);
    
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
        console.error(`[AUTH:PROVIDER] Erro ao criar conta: ${error.message}`);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error('[AUTH:PROVIDER] Usuário já existe');
        toast({
          title: "Erro ao criar conta",
          description: "Este e-mail já está registrado.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if email confirmation is required
      if (data?.user && !data.session) {
        console.log('[AUTH:PROVIDER] Confirmação de email necessária');
        toast({
          title: "Conta criada com sucesso",
          description: "Um e-mail de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu e-mail para fazer login.",
        });
      } else {
        console.log('[AUTH:PROVIDER] Conta criada e autenticada automaticamente');
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você foi autenticado automaticamente."
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("[AUTH:PROVIDER] Signup error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    console.log('[AUTH:PROVIDER] Desconectando usuário');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error(`[AUTH:PROVIDER] Erro ao fazer logout: ${error.message}`);
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setCurrentUser(null);
        setSession(null);
        console.log('[AUTH:PROVIDER] Usuário desconectado com sucesso');
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
      }
    } catch (error: any) {
      console.error("[AUTH:PROVIDER] Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
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
