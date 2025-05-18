
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { mapSupabaseUser } from './userProfileUtils';
import { User } from '../../types/user';
import { Session } from '@supabase/supabase-js';

export interface AuthServiceResult {
  user: User | null;
  session: Session | null;
  error: any | null;
}

// Fetch user profile data
export const fetchUserProfile = async (user: any): Promise<User> => {
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    return mapSupabaseUser(user, profileData);
  } catch (error) {
    console.error("[AuthService] Erro ao buscar perfil do usuário:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro ao carregar os dados do perfil do usuário");
    return mapSupabaseUser(user);
  }
};

// Login function
export const login = async (email: string, password: string): Promise<{ success: boolean, error?: any, user?: any, session?: Session | null }> => {
  try {
    console.log("[AuthService] Tentando login com email:", email);
    console.log("[AuthService] DETALHES EM PORTUGUÊS: Tentando fazer login com o email:", email);
    
    // Enhanced login with explicit storage options
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("[AuthService] Erro de login:", error.message);
      console.error("[AuthService] DETALHES EM PORTUGUÊS: Falha ao fazer login. Erro:", error.message);
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Falha no login",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      return { success: false, error };
    }
    
    console.log("[AuthService] Login bem-sucedido:", data.user?.email);
    console.log("[AuthService] DETALHES EM PORTUGUÊS: Login realizado com sucesso");
    
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo de volta!",
    });
    
    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error("[AuthService] Erro de login:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante o processo de login");
    
    const errorDetails = processAuthError(error);
    
    toast({
      title: "Erro no login",
      description: errorDetails.message,
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: any }> => {
  try {
    console.log("[AuthService] Solicitando redefinição de senha para:", email);
    console.log("[AuthService] DETALHES EM PORTUGUÊS: Enviando email de recuperação de senha");
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      console.error("[AuthService] Erro ao enviar email de recuperação:", error);
      console.error("[AuthService] DETALHES EM PORTUGUÊS: Não foi possível enviar o email de recuperação de senha");
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Erro na recuperação de senha",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      return { success: false, error };
    }
    
    console.log("[AuthService] Email de recuperação enviado para:", email);
    console.log("[AuthService] DETALHES EM PORTUGUÊS: Email de recuperação de senha enviado com sucesso");
    
    toast({
      title: "Email enviado",
      description: `Verifique sua caixa de entrada em ${email}`,
    });
    
    return { success: true };
  } catch (error) {
    console.error("[AuthService] Erro ao enviar email de recuperação:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao tentar enviar o email");
    
    const errorDetails = processAuthError(error);
    
    toast({
      title: "Erro na recuperação de senha",
      description: errorDetails.message,
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};

// Signup function
export const signup = async (email: string, password: string, name: string): Promise<{ success: boolean, error?: any, user?: User | null, session?: Session | null }> => {
  try {
    console.log("[AuthService] Tentando criar conta com email:", email);
    console.log("[AuthService] DETALHES EM PORTUGUÊS: Iniciando processo de criação de conta");
    
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
      console.error("[AuthService] Erro no cadastro:", error.message);
      console.error("[AuthService] DETALHES EM PORTUGUÊS: Falha ao criar nova conta. Erro:", error.message);
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Falha na criação da conta",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      return { success: false, error };
    }
    
    if (data?.user?.identities?.length === 0) {
      console.error("[AuthService] Usuário já existe");
      console.error("[AuthService] DETALHES EM PORTUGUÊS: Este email já está registrado no sistema");
      
      toast({
        title: "Falha na criação da conta",
        description: "Este email já está registrado.",
        variant: "destructive"
      });
      
      return { success: false };
    }
    
    // Check if email confirmation is required
    if (data?.user && data.session) {
      console.log("[AuthService] Conta criada e autenticada automaticamente");
      console.log("[AuthService] DETALHES EM PORTUGUÊS: Conta criada com sucesso e login efetuado automaticamente");
      
      toast({
        title: "Conta criada com sucesso",
        description: "Sua conta foi criada e você foi autenticado automaticamente."
      });
      
      return { success: true, user: data.user, session: data.session };
    } else if (data?.user) {
      console.log("[AuthService] Confirmação de email necessária");
      console.log("[AuthService] DETALHES EM PORTUGUÊS: Conta criada. É necessário confirmar o email antes de fazer login");
      
      toast({
        title: "Conta criada com sucesso",
        description: "Um email de confirmação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada e confirme seu email para entrar.",
      });
      
      return { success: true };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("[AuthService] Erro no cadastro:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante a criação da conta");
    
    const errorDetails = processAuthError(error);
    
    toast({
      title: "Falha na criação da conta",
      description: errorDetails.message,
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};

// Check current auth session
export const checkAuthSession = async (): Promise<{ isAuthenticated: boolean, session: Session | null, user: User | null, error?: any }> => {
  try {
    // Clear any ongoing logout process flags first
    const logoutInProgress = localStorage.getItem('logout_in_progress');
    if (logoutInProgress === 'true') {
      console.log("[AuthService] Detectado logout em progresso, limpando flag");
      localStorage.removeItem('logout_in_progress');
      return { isAuthenticated: false, session: null, user: null, error: null };
    }

    // Check if there's a session token in localStorage before making an API call
    const tokenString = localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
    if (!tokenString) {
      console.log("[AuthService] Nenhum token encontrado no localStorage");
      return { isAuthenticated: false, session: null, user: null, error: null };
    }

    // Now verify with Supabase if the token is valid
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[AuthService] Erro ao verificar status de autenticação:", error);
      console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro ao verificar se o usuário está autenticado");
      return { isAuthenticated: false, session: null, user: null, error };
    }
    
    const isAuthenticated = !!data.session;
    console.log("[AuthService] Status de autenticação verificado:", isAuthenticated ? "Autenticado" : "Não autenticado");
    
    let user = null;
    if (data.session?.user) {
      user = await fetchUserProfile(data.session.user);
    }
    
    return {
      isAuthenticated,
      session: data.session,
      user
    };
  } catch (error) {
    console.error("[AuthService] Erro inesperado ao verificar autenticação:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao verificar o status de autenticação");
    return { isAuthenticated: false, session: null, user: null, error };
  }
};
