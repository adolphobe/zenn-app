
import { supabase } from '@/integrations/supabase/client';

export const login = async (email: string, password: string) => {
  try {
    console.log("[LoginService] Tentando login com:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("[LoginService] Erro de login:", error.message);
      
      // Mapear erros específicos do Supabase para mensagens mais amigáveis
      if (error.message.includes('Invalid login credentials')) {
        return { 
          success: false, 
          error: "Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais." 
        };
      }
      
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: "Por favor, confirme seu e-mail antes de fazer login."
        };
      }
      
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return {
          success: false,
          error: "Muitas tentativas de login. Aguarde um momento e tente novamente."
        };
      }
      
      // Erro genérico
      return { 
        success: false, 
        error: "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
      };
    }
    
    if (!data.user || !data.session) {
      console.error("[LoginService] Login falhou: Usuário ou sessão indefinidos");
      return {
        success: false,
        error: "Falha na autenticação. Por favor, tente novamente."
      };
    }
    
    console.log("[LoginService] Login bem-sucedido para:", data.user?.email);
    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error("[LoginService] Erro inesperado:", error);
    return { 
      success: false, 
      error: "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
    };
  }
};
