
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../types/user';
import { mapSupabaseUser } from './userProfileUtils';

// Fetch user profile data
export const fetchUserProfile = async (user: any): Promise<User> => {
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    return mapSupabaseUser(user, profileData);
  } catch (error) {
    console.error("[AuthService] Erro ao buscar perfil do usuário:", error);
    console.error("[AuthService] DETALHES EM PORTUGUÊS: Ocorreu um erro ao carregar os dados do perfil do usuário");
    return mapSupabaseUser(user);
  }
};
