
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '../../../types/user';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, checkAuthSession } from '../authService';

export function useAuthState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] Inicializando estado de autenticação");
    
    // Check for logout in progress flag and clear it if it exists on page load
    const logoutInProgress = localStorage.getItem('logout_in_progress');
    if (logoutInProgress === 'true') {
      console.log("[AuthProvider] Detectada flag de logout em andamento ao inicializar, limpando");
      localStorage.removeItem('logout_in_progress');
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
    }
    
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    // Set up auth state change listener FIRST
    const setupAuthListener = () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("[AuthProvider] Estado de autenticação alterado:", event);
            
            // Update session state
            setSession(newSession);
            
            if (event === 'SIGNED_OUT') {
              console.log("[AuthProvider] Usuário deslogado");
              setCurrentUser(null);
              setIsLoading(false);
              return;
            }
            
            // Use setTimeout to prevent potential race conditions
            if (newSession?.user) {
              console.log("[AuthProvider] Nova sessão detectada");
              
              // Use setTimeout to avoid race conditions
              setTimeout(() => {
                fetchUserProfile(newSession.user)
                  .then(user => {
                    setCurrentUser(user);
                    setIsLoading(false);
                    setAuthInitialized(true);
                  });
              }, 0);
            }
          }
        );
        
        authSubscription = subscription;
        return true;
      } catch (error) {
        console.error("[AuthProvider] Erro ao configurar listener de autenticação:", error);
        return false;
      }
    };
    
    // First set up the auth listener
    const listenerSetup = setupAuthListener();
    
    if (!listenerSetup) {
      console.error("[AuthProvider] Falha ao configurar listener de autenticação");
      setIsLoading(false);
    }
    
    // THEN check for existing session
    const checkInitialSession = async () => {
      try {
        console.log("[AuthProvider] Verificando sessão inicial...");
        
        const { isAuthenticated, session, user, error } = await checkAuthSession();
        
        if (error) {
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        console.log("[AuthProvider] Verificação inicial da sessão:", isAuthenticated ? "Sessão encontrada" : "Nenhuma sessão");
        
        if (isAuthenticated && session && user) {
          setSession(session);
          setCurrentUser(user);
        } 
        
        // Always update loading state regardless of auth status
        setIsLoading(false);
        setAuthInitialized(true);
      } catch (error) {
        console.error("[AuthProvider] Erro ao verificar sessão");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };
    
    // Check for initial session after setting up the listener
    setTimeout(() => {
      checkInitialSession();
    }, 10); // Small delay to ensure listener is registered first
    
    // Clean up subscription on unmount
    return () => {
      console.log("[AuthProvider] Limpando - cancelando inscrição em eventos de autenticação");
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  return {
    currentUser,
    setCurrentUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    authInitialized
  };
}
