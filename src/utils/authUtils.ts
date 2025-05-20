
import { supabase } from '@/integrations/supabase/client';
import { User, UserPreferences } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { fetchUserPreferences } from '@/services/preferencesService';
import { mapSupabaseUser } from '@/context/auth/userProfileUtils';
import { TokenManager } from './tokenManager';
import { AuthThrottle, withAuthThrottle } from './authThrottle';

// Função auxiliar para criar um pequeno delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Utilitário para realizar logout com melhor tratamento de erros e estados
 */
export const performLogout = withAuthThrottle(async (navigate: any) => {
  try {
    console.log("[AuthUtils] Iniciando processo completo de logout");
    
    // Verifica se já existe um logout em andamento
    if (TokenManager.isLogoutInProgress()) {
      console.log("[AuthUtils] Logout já em andamento, ignorando nova solicitação");
      return false;
    }
    
    // Define flag para prevenir múltiplas tentativas de logout
    TokenManager.setLogoutInProgress(true);
    
    // Limpar dados do usuário do localStorage
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_preferences');
    
    // Limpar tokens de autenticação
    TokenManager.clearAllTokens();
    
    try {
      // Fazer logout no Supabase
      await supabase.auth.signOut({ scope: 'global' });
    } catch (logoutError) {
      console.error("[AuthUtils] Erro ao chamar supabase.auth.signOut:", logoutError);
      // Mesmo com erro, continuamos com a limpeza local
    }
    
    // Pequeno delay para garantir que o Supabase processou o logout
    await wait(200);
    
    // Redirecionar para a página de login com parâmetro de timestamp
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
    
    return true;
  } catch (error) {
    console.error("[AuthUtils] Erro ao fazer logout:", error);
    
    // Em caso de erro, limpar flag de logout em andamento
    TokenManager.setLogoutInProgress(false);
    
    return false;
  } finally {
    // Garantir que a flag será removida após um tempo, mesmo em caso de outros erros
    setTimeout(() => {
      TokenManager.setLogoutInProgress(false);
    }, 3000);
  }
});

/**
 * Utilitário para obter usuário autenticado com melhor tratamento de erros
 */
export const getAuthenticatedUser = async () => {
  try {
    // Verifica primeiro se existe um token antes de fazer chamada à API
    if (!TokenManager.hasAuthToken()) {
      console.log("[AuthUtils] Nenhum token encontrado, não será feita chamada à API");
      return null;
    }

    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    
    // Buscar preferências do usuário
    const userPreferences = await fetchUserPreferences(data.user.id) as UserPreferences | null;
    
    // Mapear o usuário com suas preferências
    return mapSupabaseUser(data.user, { preferences: userPreferences });
  } catch (error) {
    console.error("[AuthUtils] Erro ao obter usuário autenticado:", error);
    return null;
  }
};
