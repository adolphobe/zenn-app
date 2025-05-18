
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Login function
export const login = async (email: string, password: string): Promise<{ success: boolean, error?: any, user?: any, session?: Session | null }> => {
  try {
    console.log("[AuthService] Tentando login com email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("[AuthService] Erro de login:", error.message);
      return { success: false, error };
    }
    
    console.log("[AuthService] Login bem-sucedido:", data.user?.email);
    
    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error("[AuthService] Erro de login inesperado:", error);
    
    return { success: false, error };
  }
};
