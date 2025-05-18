
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { Session } from '@supabase/supabase-js';

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
      
      // Removido toast de erro aqui para evitar duplicação com o componente de erro do formulário
      
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
    console.error("[AuthService] Erro de login inesperado:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado durante o processo de login");
    
    // Removido toast de erro aqui para evitar duplicação com o componente de erro do formulário
    
    return { success: false, error };
  }
};
