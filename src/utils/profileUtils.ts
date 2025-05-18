
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProfileUpdateData {
  profileImage?: string;
  name?: string;
  // Add more fields as needed
}

export const updateUserProfile = async (userId: string, data: ProfileUpdateData) => {
  try {
    // Update the profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_url: data.profileImage,
        ...(data.name && { full_name: data.name }),
      })
      .eq('id', userId);

    if (error) throw error;
    
    // Update the local session user_metadata
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (!sessionError && sessionData.session) {
      // Update the session user metadata
      await supabase.auth.updateUser({
        data: { 
          avatar_url: data.profileImage,
          ...(data.name && { name: data.name })
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
