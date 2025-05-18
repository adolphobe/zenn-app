
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { processAuthError } from './authErrorUtils';
import { savePreferencesToLocalStorage } from '@/services/preferencesService';

/**
 * Performs a complete logout, clearing all session data and redirecting to login
 */
export const performLogout = async (navigate: NavigateFunction): Promise<void> => {
  console.log("[AuthUtils] Iniciando processo completo de logout");
  console.log("[AuthUtils] DETALHES EM PORTUGUÊS: Limpando todos os dados de sessão");
  
  try {
    // Set logout in progress flag to prevent multiple logout attempts
    localStorage.setItem('logout_in_progress', 'true');
    
    // Backup current preferences to localStorage before clearing session
    // This ensures preferences are preserved for the next login
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', data.session.user.id)
          .maybeSingle();
          
        if (profileData?.preferences) {
          savePreferencesToLocalStorage(profileData.preferences);
        }
      }
    } catch (e) {
      console.warn("[AuthUtils] Não foi possível fazer backup das preferências:", e);
    }
    
    // Clear any Supabase tokens manually first to ensure session is invalidated
    localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
    localStorage.removeItem('supabase.auth.token');
    
    // Call Supabase signOut with global scope to ensure complete logout across all devices
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      const errorDetails = processAuthError(error);
      console.error("[AuthUtils] Erro durante logout:", errorDetails);
      console.error("[AuthUtils] DETALHES EM PORTUGUÊS:", errorDetails.message);
      
      toast({
        title: "Alerta no logout",
        description: "Ocorreu um problema, mas o logout local foi concluído.",
        variant: "destructive",
      });
    }
    
    // Wait a moment to ensure complete session termination
    // This helps prevent issues with rapid navigation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Show success toast
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    
    // Clear logout flag
    localStorage.removeItem('logout_in_progress');
    
    // Force redirect to login page with clear cache params
    const timestamp = new Date().getTime();
    navigate('/login', { 
      state: { 
        loggedOut: true,
        timestamp,
        forceClear: true // Special flag to ensure session is considered cleared
      },
      replace: true // Use replace to prevent back navigation to authenticated routes
    });
    
  } catch (error) {
    console.error("[AuthUtils] Erro durante logout:", error);
    console.error("[AuthUtils] DETALHES EM PORTUGUÊS: Ocorreu um erro ao finalizar a sessão");
    
    // Clear logout flag even on error
    localStorage.removeItem('logout_in_progress');
    
    const errorDetails = processAuthError(error);
    
    toast({
      title: "Erro ao sair",
      description: errorDetails.message,
      variant: "destructive",
    });
    
    // Force redirect to login anyway to break potential loops
    navigate('/login', { replace: true });
  }
};

/**
 * Checks if an active session exists and verifies with Supabase
 * Useful for route guards and initial auth state checks
 */
export const checkAuthStatus = async () => {
  try {
    // Clear any ongoing logout process flags first
    const logoutInProgress = localStorage.getItem('logout_in_progress');
    if (logoutInProgress === 'true') {
      console.log("[AuthStatus] Detectado logout em progresso, limpando flag");
      localStorage.removeItem('logout_in_progress');
      return { isAuthenticated: false, error: null };
    }

    // Check if there's a session token in localStorage before making an API call
    const tokenString = localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
    if (!tokenString) {
      console.log("[AuthUtils] Nenhum token encontrado no localStorage");
      return { isAuthenticated: false, error: null };
    }

    // Now verify with Supabase if the token is valid
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[AuthUtils] Erro ao verificar status de autenticação:", error);
      console.error("[AuthUtils] DETALHES EM PORTUGUÊS: Ocorreu um erro ao verificar se o usuário está autenticado");
      return { isAuthenticated: false, error };
    }
    
    const isAuthenticated = !!data.session;
    console.log("[AuthUtils] Status de autenticação verificado:", isAuthenticated ? "Autenticado" : "Não autenticado");
    
    return {
      isAuthenticated,
      session: data.session,
      user: data.session?.user
    };
  } catch (error) {
    console.error("[AuthUtils] Erro inesperado ao verificar autenticação:", error);
    console.error("[AuthUtils] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao verificar o status de autenticação");
    return { isAuthenticated: false, error };
  }
};
