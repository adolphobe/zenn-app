
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';

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
