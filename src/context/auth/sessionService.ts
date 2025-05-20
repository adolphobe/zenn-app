
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '../../types/user';
import { fetchUserProfile } from './userProfileService';
import { TokenManager } from '@/utils/tokenManager';

export interface AuthSessionResult {
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  error?: any;
}

/**
 * Verificação de sessão com melhor tratamento de erro e prevenção contra chamadas desnecessárias
 */
export const checkAuthSession = async (): Promise<AuthSessionResult> => {
  try {
    // Verificar primeiro se existe um logout em andamento
    if (TokenManager.isLogoutInProgress()) {
      console.log("[AuthService] Detectado logout em progresso, ignorando verificação de sessão");
      return { isAuthenticated: false, session: null, user: null, error: null };
    }

    // Verificar se existe token no localStorage antes de fazer chamada à API
    if (!TokenManager.hasAuthToken()) {
      console.log("[AuthService] Nenhum token encontrado no localStorage");
      return { isAuthenticated: false, session: null, user: null, error: null };
    }

    // Verificar com o Supabase se o token é válido
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[AuthService] Erro ao verificar status de autenticação:", error);
      
      // Em caso de erro de autenticação, limpar tokens para evitar loops
      if (error.message.includes('invalid token') || error.message.includes('JWT expired')) {
        console.log("[AuthService] Token inválido ou expirado, limpando tokens");
        TokenManager.clearAllTokens();
      }
      
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
    return { isAuthenticated: false, session: null, user: null, error };
  }
};
