
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '../../types/user';
import { fetchUserProfile } from './userProfileService';

export interface AuthSessionResult {
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  error?: any;
}

// Check current auth session
export const checkAuthSession = async (): Promise<AuthSessionResult> => {
  try {
    // Clear any ongoing logout process flags first
    const logoutInProgress = localStorage.getItem('logout_in_progress');
    if (logoutInProgress === 'true') {
      console.log("[AuthService] Detectado logout em progresso, limpando flag");
      localStorage.removeItem('logout_in_progress');
      return { isAuthenticated: false, session: null, user: null, error: null };
    }

    // Check if there's a session token in localStorage before making an API call
    const tokenString = localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
    if (!tokenString) {
      console.log("[AuthService] Nenhum token encontrado no localStorage");
      return { isAuthenticated: false, session: null, user: null, error: null };
    }

    // Now verify with Supabase if the token is valid
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[AuthService] Erro ao verificar status de autenticação:", error);
      console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro ao verificar se o usuário está autenticado");
      return { isAuthenticated: false, session: null, user: null, error };
    }
    
    const isAuthenticated = !!data.session;
    console.log("[AuthService] Status de autenticação verificado:", isAuthenticated ? "Autenticado" : "Não autenticado");
    
    let user = null;
    if (data.session?.user) {
      user = await fetchUserProfile(data.session.user);
    }
    
    return {
      isAuthenticated,
      session: data.session,
      user
    };
  } catch (error) {
    console.error("[AuthService] Erro inesperado ao verificar autenticação:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao verificar o status de autenticação");
    return { isAuthenticated: false, session: null, user: null, error };
  }
};
