
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
      return { 
        success: false, 
        error: "Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais."
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
