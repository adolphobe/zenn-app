
/**
 * Constantes relacionadas à autenticação
 * Centraliza todos os nomes de chaves usadas no localStorage
 */

// Token principal do Supabase
export const SUPABASE_AUTH_TOKEN_KEY = 'sb-wbvxnapruffchikhrqrs-auth-token';

// Token legado (para compatibilidade)
export const LEGACY_AUTH_TOKEN_KEY = 'supabase.auth.token';

// Flags de controle de estado
export const LOGOUT_IN_PROGRESS_KEY = 'logout_in_progress';
export const LOGIN_SUCCESS_KEY = 'login_success';
export const INITIAL_LOAD_COMPLETE_KEY = 'initial_load_complete';

// Tempo mínimo entre tentativas de login/logout (em ms)
export const AUTH_COOLDOWN_PERIOD = 1000;

// Tempo de debounce para operações de autenticação (em ms)
export const AUTH_DEBOUNCE_DELAY = 300;

// Tempos de carregamento (em ms)
export const INITIAL_LOAD_DELAY = 1800;
export const INTERNAL_NAVIGATION_DELAY = 0;  // Reduced to zero for internal navigation

// Navegação
export const RECENT_NAVIGATION_THRESHOLD = 30000; // 30 seconds
