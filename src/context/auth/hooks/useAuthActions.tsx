
import React, { useState } from 'react';
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
    console.log("[AuthProvider] Iniciando processo de logout");
    
    try {
      setIsLoading(true);
      
      // Marcar que um logout está em andamento para evitar redirecionamentos indevidos
      localStorage.setItem('logout_in_progress', 'true');
      
      // Limpar estados locais 
      setCurrentUser(null);
      setSession(null);
      
      // Remover dados de autenticação armazenados localmente
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      // Chamar signOut do Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("[AuthProvider] Erro no logout");
        
        const errorDetails = processAuthError(error);
        
        toast({
          title: "Falha no logout",
          description: errorDetails.message,
          variant: "destructive"
        });
      } else {
        console.log("[AuthProvider] Usuário deslogado com sucesso");
        
        toast({
          title: "Logout realizado",
          description: "Você saiu com sucesso",
        });
      }
    } catch (error) {
      console.error("[AuthProvider] Erro durante logout");
      
      const errorDetails = processAuthError(error);
    } finally {
      // Sempre limpar os estados do usuário e sessão ao fazer logout
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
