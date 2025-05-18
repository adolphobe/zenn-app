
import { supabase } from '@/integrations/supabase/client';
import { User, UserPreferences } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { fetchUserPreferences } from '@/services/preferencesService';
import { mapSupabaseUser } from '@/context/auth/userProfileUtils';

// Utility function to perform logout
export const performLogout = async (navigate: any) => {
  try {
    console.log("[AuthUtils] Iniciando processo completo de logout");
    
    // Set a flag to prevent multiple logout attempts
    localStorage.setItem('logout_in_progress', 'true');
    
    // Clear any user-related data from localStorage
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_preferences');
    localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
    localStorage.removeItem('supabase.auth.token');
    
    // Log the user out from Supabase
    await supabase.auth.signOut({ scope: 'global' });
    
    // Usando timeout para dar tempo ao Supabase para processar o logout
    setTimeout(() => {
      // Redirect to the login page with a forced parameter to ensure fresh state
      const timestamp = new Date().getTime();
      navigate(`/login?loggedOut=true&timestamp=${timestamp}`, { 
        replace: true,
        state: { 
          loggedOut: true, 
          timestamp: timestamp,
          forceClear: true
        } 
      });
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    localStorage.removeItem('logout_in_progress');
    return false;
  }
};

// Utility function to get user from Supabase and fetch their profile preferences
export const getAuthenticatedUser = async () => {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    
    // Fetch user preferences
    const userPreferences = await fetchUserPreferences(data.user.id) as UserPreferences | null;
    
    // Map the user with their preferences
    return mapSupabaseUser(data.user, { preferences: userPreferences });
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
};
