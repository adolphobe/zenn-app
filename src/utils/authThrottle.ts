
import { AUTH_COOLDOWN_PERIOD } from './authConstants';

// Armazena o timestamp da última operação de autenticação
let lastAuthOperationTime = 0;

/**
 * Utilitário para controlar a frequência de operações de autenticação
 * Previne múltiplas tentativas em sequência muito rápida
 */
export const AuthThrottle = {
  /**
   * Verifica se uma operação de autenticação pode ser executada
   * @returns {boolean} True se a operação pode prosseguir, false se está em cooldown
   */
  canProceed: (): boolean => {
    const now = Date.now();
    const timeSinceLastOperation = now - lastAuthOperationTime;
    
    return timeSinceLastOperation > AUTH_COOLDOWN_PERIOD;
  },

  /**
   * Registra uma nova operação de autenticação
   */
  registerOperation: (): void => {
    lastAuthOperationTime = Date.now();
  },

  /**
   * Verifica se pode prosseguir e já registra a operação se possível
   * @returns {boolean} True se a operação pode prosseguir, false se está em cooldown
   */
  checkAndRegister: (): boolean => {
    if (AuthThrottle.canProceed()) {
      AuthThrottle.registerOperation();
      return true;
    }
    return false;
  }
};

/**
 * Decorator para funções de autenticação que aplica controle de cooldown
 * @param fn Função a ser executada com throttle
 * @returns Função com throttle aplicado
 */
export function withAuthThrottle<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    if (AuthThrottle.checkAndRegister()) {
      return await fn(...args);
    }
    
    console.warn('[AuthThrottle] Operação bloqueada por cooldown. Tente novamente em alguns segundos.');
    return null;
  };
}
