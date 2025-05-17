import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStoredAuth } from '../../mock/authUtils';
import { AuthStateHookResult } from '../types';

// Hook constants
const AUTH_CHECK_INTERVAL = 60 * 1000; // Check every 1 minute
const TOKEN_RECENT_THRESHOLD = 30; // Seconds

export const useAuthCheck = (authState: AuthStateHookResult) => {
  const {
    setCurrentUser,
    setAuthError,
    currentUser,
    lastAuthCheck,
    setLastAuthCheck,
    checkPendingLogin,
    logAuth,
    setIsLoading
  } = authState;
  
  const location = useLocation();
  
  // Check authentication - centralized token verification function
  const checkAuth = useCallback(async () => {
    logAuth("Verificando autenticação...");
    setLastAuthCheck(new Date());
    
    try {
      const { user, isValid } = getStoredAuth();
      
      if (isValid && user) {
        logAuth("Autenticação válida encontrada", { userId: user.id });
        setCurrentUser(user);
        setAuthError(null);
        
        // Apply user preferences
        if (user.preferences) {
          // Keeping track of user preferences
          // This stays with the user object, no need to extract
        }
      } else {
        logAuth("Autenticação inválida ou não encontrada", { isValid });
        // Check if there's a pending login
        if (checkPendingLogin()) {
          setAuthError('connection_lost');
        } else if (isValid === false) {
          setAuthError('session_expired');
        }
        setCurrentUser(null);
      }
    } catch (error) {
      logAuth("Erro ao verificar autenticação", error);
      setCurrentUser(null);
      setAuthError('connection_lost');
    } finally {
      logAuth("Verificação de autenticação concluída");
      setIsLoading(false);
    }
  }, [checkPendingLogin, logAuth, setAuthError, setCurrentUser, setIsLoading, setLastAuthCheck]);

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Periodically verify token validity
  useEffect(() => {
    if (!currentUser) return;
    
    const checkTokenValidity = () => {
      const now = new Date();
      const secondsSinceLastCheck = (now.getTime() - lastAuthCheck.getTime()) / 1000;
      
      logAuth(`Verificação periódica de token (${secondsSinceLastCheck.toFixed(1)}s desde última verificação)`);
      
      if (secondsSinceLastCheck > TOKEN_RECENT_THRESHOLD) {
        const { isValid } = getStoredAuth();
        if (!isValid) {
          logAuth("Token expirou durante a sessão");
          setAuthError('session_expired');
          setCurrentUser(null);
        } else {
          logAuth("Token ainda é válido");
        }
        setLastAuthCheck(now);
      }
    };
    
    const intervalId = setInterval(checkTokenValidity, AUTH_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [currentUser, lastAuthCheck, logAuth, setAuthError, setCurrentUser, setLastAuthCheck]);
  
  // Check authentication on every route change for protected routes
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      logAuth(`Mudança para rota protegida "${location.pathname}" - verificando autenticação`);
      
      // Force verification on each protected route change
      const { isValid } = getStoredAuth();
      if (!isValid && currentUser) {
        logAuth("Token inválido detectado na mudança de rota");
        setAuthError('session_expired');
        setCurrentUser(null);
      } else if (isValid && currentUser) {
        logAuth("Token válido na mudança de rota");
      }
      
      // Update last check timestamp
      setLastAuthCheck(new Date());
    }
  }, [location.pathname, currentUser, logAuth, setAuthError, setCurrentUser, setLastAuthCheck]);

  return { checkAuth };
};
