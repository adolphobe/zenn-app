
import { User } from '../types/user';
import { getUserById } from '../mock/users';

// Constantes de armazenamento
const TOKEN_KEY = 'acto_auth_token';
const USER_ID_KEY = 'acto_user_id';
const IS_LOGGED_IN_KEY = 'acto_is_logged_in';
const TOKEN_EXPIRES_KEY = `${TOKEN_KEY}_expires`;

/**
 * Versão simplificada e robusta para armazenar autenticação
 */
export const storeAuthSecurely = (user: User): void => {
  // Criar um token simples baseado no ID do usuário e timestamp
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 10);
  const token = btoa(`${user.id}:${timestamp}:${randomPart}`);
  
  // Definir expiração para 7 dias
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Armazenar dados
  console.log("[AUTH-FIX] Armazenando autenticação para usuário:", user.email);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, user.id);
  localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
  localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toISOString());
  
  // Armazenar dados de usuário para recuperação rápida
  localStorage.setItem('acto_user_data', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage || '',
    lastLoginAt: new Date().toISOString()
  }));
};

/**
 * Verifica a autenticação sem efeitos colaterais
 */
export const checkAuthSecurely = (): { isAuth: boolean; user: User | null } => {
  try {
    // Obter dados de autenticação
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);
    const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
    const tokenExpires = localStorage.getItem(TOKEN_EXPIRES_KEY);
    
    // Verificar validade básica
    if (!token || !userId || !isLoggedIn || !tokenExpires) {
      console.log("[AUTH-FIX] Dados de autenticação ausentes ou incompletos");
      return { isAuth: false, user: null };
    }
    
    // Verificar expiração
    const now = new Date();
    const expiresAt = new Date(tokenExpires);
    
    if (now > expiresAt) {
      console.log("[AUTH-FIX] Token expirado");
      return { isAuth: false, user: null };
    }
    
    // Buscar usuário
    const user = getUserById(userId);
    if (!user) {
      console.log("[AUTH-FIX] Usuário não encontrado:", userId);
      return { isAuth: false, user: null };
    }
    
    // Autenticação válida
    console.log("[AUTH-FIX] Autenticação válida para:", user.email);
    return { isAuth: true, user };
  } catch (error) {
    console.error("[AUTH-FIX] Erro na verificação de autenticação:", error);
    return { isAuth: false, user: null };
  }
};

/**
 * Limpa dados de autenticação
 */
export const clearAuthSecurely = (): void => {
  console.log("[AUTH-FIX] Limpando dados de autenticação");
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_KEY);
  localStorage.removeItem('acto_user_data');
};
