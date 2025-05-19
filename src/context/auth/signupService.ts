
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { Session } from '@supabase/supabase-js';

// Signup function
export const signup = async (email: string, password: string, name: string): Promise<{ success: boolean, error?: any, user?: any, session?: Session | null }> => {
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
