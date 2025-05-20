
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '../../../types/user';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, checkAuthSession } from '../authService';
import { TokenManager } from '@/utils/tokenManager';

export function useAuthState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] Inicializando estado de autenticação");
    
    // Verificar e limpar flag de logout em andamento ao inicializar
    if (TokenManager.isLogoutInProgress()) {
      console.log("[AuthProvider] Detectada flag de logout em andamento ao inicializar, limpando");
      TokenManager.clearAllFlags();
      TokenManager.clearAllTokens();
    }
    
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    // Configurar o listener de mudanças no estado de autenticação PRIMEIRO
    const setupAuthListener = () => {
      try {
        // Usar um estado local para controlar o processamento de eventos simultâneos
        let isProcessingAuthChange = false;
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("[AuthProvider] Estado de autenticação alterado:", event);
            
            // Evitar processamento simultâneo de eventos
            if (isProcessingAuthChange) {
              console.log("[AuthProvider] Já processando um evento de autenticação, ignorando novo evento");
              return;
            }
            
            isProcessingAuthChange = true;
            
            // Atualizar estado da sessão
            setSession(newSession);
            
            if (event === 'SIGNED_OUT') {
              console.log("[AuthProvider] Usuário deslogado");
              setCurrentUser(null);
              setIsLoading(false);
              isProcessingAuthChange = false;
              return;
            }
            
            // Se houver uma nova sessão, buscar perfil do usuário
            if (newSession?.user) {
              console.log("[AuthProvider] Nova sessão detectada");
              
              // Usar setTimeout para evitar condições de corrida
              setTimeout(() => {
                fetchUserProfile(newSession.user)
                  .then(user => {
                    setCurrentUser(user);
                    setIsLoading(false);
                    setAuthInitialized(true);
                  })
                  .finally(() => {
                    isProcessingAuthChange = false;
                  });
              }, 50);
            } else {
              isProcessingAuthChange = false;
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
    
    // Primeiro configurar o listener de autenticação
    const listenerSetup = setupAuthListener();
    
    if (!listenerSetup) {
      console.error("[AuthProvider] Falha ao configurar listener de autenticação, tentando recuperar sessão existente");
      setIsLoading(false);
    }
    
    // DEPOIS verificar se existe uma sessão
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
        
        // Sempre atualizar estado de loading independente do status de autenticação
        setIsLoading(false);
        setAuthInitialized(true);
      } catch (error) {
        console.error("[AuthProvider] Erro ao verificar sessão:", error);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };
    
    // Verificar sessão inicial após configurar o listener
    setTimeout(() => {
      checkInitialSession();
    }, 50); // Pequeno delay para garantir que o listener é registrado primeiro
    
    // Limpar inscrição ao desmontar
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
