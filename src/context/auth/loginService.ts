
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { Session } from '@supabase/supabase-js';

// Login function
export const login = async (email: string, password: string): Promise<{ success: boolean, error?: any, user?: any, session?: Session | null }> => {
  try {
    console.log("[AuthService] Tentando login com email:", email);
    
    // Enhanced login with explicit storage options
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("[AuthService] Erro de login:", error.message);
      
      // Return the error explicitly without showing toast
      // The error will be handled by the component
      return { success: false, error };
    }
    
    console.log("[AuthService] Login bem-sucedido:", data.user?.email);
    
    // Don't show success toast here, let the component handle it
    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error("[AuthService] Erro de login:", error);
    
    // Return the error without showing toast
    return { success: false, error };
  }
};
