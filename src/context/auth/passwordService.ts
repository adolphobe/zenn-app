
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';

// Production URL for password reset
const RESET_PASSWORD_URL = "https://zenn-app.lovable.app/reset-password";

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: any }> => {
  try {
    console.log("[AuthService] Solicitando redefinição de senha para:", email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: RESET_PASSWORD_URL,
    });
    
    if (error) {
      console.error("[AuthService] Erro ao enviar email de recuperação:", error);
      
      const errorDetails = processAuthError(error);
      
      toast({
        title: "Erro na recuperação de senha",
        description: errorDetails.message,
        variant: "destructive"
      });
      
      return { success: false, error };
    }
    
    console.log("[AuthService] Email de recuperação enviado para:", email);
    
    toast({
      title: "Email enviado",
      description: `Verifique sua caixa de entrada em ${email}`,
    });
    
    return { success: true };
  } catch (error) {
    console.error("[AuthService] Erro ao enviar email de recuperação:", error);
    
    const errorDetails = processAuthError(error);
    
    toast({
      title: "Erro na recuperação de senha",
      description: errorDetails.message,
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};
