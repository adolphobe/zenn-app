
import { supabase } from '@/integrations/supabase/client';
import { AuthThrottle, withAuthThrottle } from '@/utils/authThrottle';
import { TokenManager } from '@/utils/tokenManager';

/**
 * Serviço de login com melhorias de robustez e tratamento de erros
 */
export const login = withAuthThrottle(async (email: string, password: string) => {
  try {
    console.log("[LoginService] Tentando login com:", email);
    
    // Limpar quaisquer flags de operações anteriores
    TokenManager.clearAllFlags();
    
    // Tentativa de login com tratamento de erro específico
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
          error: "Muitas tentativas de login. Aguarde alguns minutos e tente novamente."
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
    
    // Marcar login como bem-sucedido
    TokenManager.setLoginSuccess(true);
    
    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error("[LoginService] Erro inesperado:", error);
    
    // Limpar tokens em caso de erro inesperado
    TokenManager.clearAllFlags();
    
    return { 
      success: false, 
      error: "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
    };
  }
});
