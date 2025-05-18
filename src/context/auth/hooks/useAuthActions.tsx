
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { processAuthError } from '@/utils/authErrorUtils';
import { login as authLogin, signup as authSignup, sendPasswordResetEmail as authSendPasswordResetEmail, fetchUserProfile } from '../authService';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../../types/user';
import { Session } from '@supabase/supabase-js';

interface AuthStateProps {
  setCurrentUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function useAuthActions({ setCurrentUser, setSession, setIsLoading }: AuthStateProps) {
  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean, error?: any }> => {
    setIsLoading(true);
    
    try {
      const result = await authLogin(email, password);
      
      if (result.success && result.user && result.session) {
        // The session will be updated by the auth state change listener
        // But we can update the user state directly
        setSession(result.session);
        const user = await fetchUserProfile(result.user);
        setCurrentUser(user);
      }
      
      setIsLoading(false);
      return { success: result.success, error: result.error };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error };
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: any }> => {
    return await authSendPasswordResetEmail(email);
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await authSignup(email, password, name);
      
      if (result.success && result.user && result.session) {
        // The session will be updated by the auth state change listener
        // But we can update the user state directly
        setSession(result.session);
        const user = await fetchUserProfile(result.user);
        setCurrentUser(user);
      }
      
      setIsLoading(false);
      return result.success;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    console.log("[AuthProvider] Iniciando processo completo de logout do usuário");
    console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Iniciando processo completo de logout no sistema");
    
    setIsLoading(true);
    
    try {
      // First clear local states 
      setCurrentUser(null);
      setSession(null);
      
      // Remove any locally stored auth data
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      // Call Supabase signOut with explicit scope to ensure all devices are logged out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("[AuthProvider] Erro no logout:", error.message);
        console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Erro ao tentar encerrar a sessão:", error.message);
        
        const errorDetails = processAuthError(error);
        
        toast({
          title: "Falha no logout",
          description: errorDetails.message,
          variant: "destructive"
        });
      } else {
        console.log("[AuthProvider] Usuário deslogado com sucesso");
        console.log("[AuthProvider] DETALHES EM PORTUGUÊS: Sessão encerrada com sucesso");
        
        toast({
          title: "Logout realizado",
          description: "Você saiu com sucesso",
        });
      }
    } catch (error) {
      console.error("[AuthProvider] Erro durante logout:", error);
      console.error("[AuthProvider] DETALHES EM PORTUGUÊS: Ocorreu um erro inesperado ao tentar encerrar a sessão");
      
      const errorDetails = processAuthError(error);
    } finally {
      // Always clear user states and session when logging out
      setCurrentUser(null);
      setSession(null);
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    sendPasswordResetEmail
  };
}
