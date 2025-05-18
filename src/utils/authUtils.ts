
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';

/**
 * Performs a complete logout, clearing all session data and redirecting to login
 */
export const performLogout = async (navigate: NavigateFunction): Promise<void> => {
  console.log("[AuthUtils] Iniciando processo completo de logout");
  console.log("[AuthUtils] DETALHES EM PORTUGUÊS: Limpando todos os dados de sessão");
  
  try {
    // Set logout in progress flag to prevent multiple logout attempts
    localStorage.setItem('logout_in_progress', 'true');
    
    // Clear any Supabase tokens manually first to ensure session is invalidated
    localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
    localStorage.removeItem('supabase.auth.token');
    
    // Call Supabase signOut with global scope to ensure complete logout across all devices
    await supabase.auth.signOut({ scope: 'global' });
    
    // Wait a moment to ensure complete session termination
    // This helps prevent issues with rapid navigation
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
    
    toast({
      title: "Erro ao sair",
      description: "Ocorreu um problema ao encerrar a sessão",
      variant: "destructive",
    });
    
    // Force redirect to login anyway to break potential loops
    navigate('/login', { replace: true });
  }
};
