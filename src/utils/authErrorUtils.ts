
/**
 * Utility functions for handling Supabase authentication errors
 * Provides better error messages and categorization for improved UX
 */

type AuthErrorType = 
  | 'invalid_credentials' 
  | 'user_not_found'
  | 'email_not_verified'
  | 'email_already_in_use' 
  | 'weak_password'
  | 'invalid_email'
  | 'network_error'
  | 'rate_limit'
  | 'captcha_required'
  | 'server_error'
  | 'unknown';

interface AuthErrorDetails {
  type: AuthErrorType;
  message: string;
  originalError?: any;
  suggestion?: string;
  logLevel: 'error' | 'warning' | 'info';
}

/**
 * Maps Supabase error messages to more user-friendly messages
 * and categorizes them for better handling
 */
export const categorizeAuthError = (error: any): AuthErrorDetails => {
  const errorMessage = error?.message || error?.error_description || 'Erro desconhecido';
  
  console.log("[AuthErrorUtils] Categorizando erro:", errorMessage);
  console.log("[AuthErrorUtils] DETALHES EM PORTUGUÊS: Analisando o erro de autenticação para fornecer informações mais precisas");
  
  // Invalid login credentials
  if (errorMessage.includes('Invalid login credentials') || 
      errorMessage.includes('Invalid email or password')) {
    return {
      type: 'invalid_credentials',
      message: 'Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.',
      originalError: error,
      suggestion: 'Verifique se digitou corretamente o email e a senha. Se esqueceu sua senha, você pode redefini-la.',
      logLevel: 'warning'
    };
  }
  
  // User not found
  if (errorMessage.includes('User not found') || 
      errorMessage.includes('No user found')) {
    return {
      type: 'user_not_found',
      message: 'Não encontramos uma conta com este email. Deseja criar uma conta?',
      originalError: error,
      suggestion: 'Verifique se digitou o email corretamente ou crie uma nova conta.',
      logLevel: 'warning'
    };
  }
  
  // Email not verified
  if (errorMessage.includes('Email not confirmed') || 
      errorMessage.includes('Email not verified')) {
    return {
      type: 'email_not_verified',
      message: 'Seu email ainda não foi verificado. Por favor, verifique sua caixa de entrada.',
      originalError: error,
      suggestion: 'Verifique seu email e clique no link de confirmação. Se não encontrar o email, podemos reenviar.',
      logLevel: 'warning'
    };
  }
  
  // Email already in use
  if (errorMessage.includes('already registered') || 
      errorMessage.includes('already in use') ||
      errorMessage.includes('already exists')) {
    return {
      type: 'email_already_in_use',
      message: 'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.',
      originalError: error,
      suggestion: 'Use outro email ou faça login se esta conta pertence a você.',
      logLevel: 'warning'
    };
  }
  
  // Password too weak
  if (errorMessage.includes('weak password') ||
      errorMessage.includes('password too short')) {
    return {
      type: 'weak_password',
      message: 'A senha é muito fraca. Use pelo menos 6 caracteres com números e letras.',
      originalError: error,
      suggestion: 'Crie uma senha mais forte com letras maiúsculas, minúsculas, números e símbolos.',
      logLevel: 'warning'
    };
  }
  
  // Invalid email format
  if (errorMessage.includes('invalid email') || 
      errorMessage.includes('malformed email')) {
    return {
      type: 'invalid_email',
      message: 'O formato do email é inválido. Por favor, verifique e tente novamente.',
      originalError: error,
      suggestion: 'Verifique se o email está digitado corretamente.',
      logLevel: 'warning'
    };
  }
  
  // Network errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('connection')) {
    return {
      type: 'network_error',
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      originalError: error,
      suggestion: 'Verifique sua conexão com a internet ou tente novamente mais tarde.',
      logLevel: 'error'
    };
  }
  
  // Rate limiting
  if (errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests') ||
      errorMessage.includes('too many attempts')) {
    return {
      type: 'rate_limit',
      message: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
      originalError: error,
      suggestion: 'Por segurança, aguarde alguns minutos antes de tentar novamente.',
      logLevel: 'warning'
    };
  }
  
  // CAPTCHA errors
  if (errorMessage.includes('captcha') || 
      errorMessage.includes('CAPTCHA')) {
    return {
      type: 'captcha_required',
      message: 'Por segurança, precisamos verificar que você não é um robô.',
      originalError: error,
      suggestion: 'Complete o desafio de segurança e tente novamente.',
      logLevel: 'warning'
    };
  }
  
  // Server errors
  if (errorMessage.includes('server') || 
      errorMessage.includes('internal') || 
      errorMessage.includes('500')) {
    return {
      type: 'server_error',
      message: 'Erro no servidor. Nossa equipe foi notificada e estamos trabalhando nisso.',
      originalError: error,
      suggestion: 'Por favor, tente novamente mais tarde.',
      logLevel: 'error'
    };
  }
  
  // Unknown errors - fallback
  return {
    type: 'unknown',
    message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    originalError: error,
    suggestion: 'Se o problema persistir, entre em contato com o suporte.',
    logLevel: 'error'
  };
};

/**
 * Logs authentication errors with consistent formatting
 */
export const logAuthError = (errorDetails: AuthErrorDetails): void => {
  const { type, message, originalError, logLevel } = errorDetails;
  
  const logFn = logLevel === 'error' 
    ? console.error 
    : logLevel === 'warning' 
      ? console.warn 
      : console.log;
  
  logFn(`[Auth Error][${type}] ${message}`, originalError);
  console.log(`[Auth Error] DETALHES EM PORTUGUÊS: Tipo - ${type}, Mensagem - ${message}`);
};

/**
 * Helper function to process Supabase authentication errors
 * Returns user-friendly error details
 */
export const processAuthError = (error: any): AuthErrorDetails => {
  const errorDetails = categorizeAuthError(error);
  logAuthError(errorDetails);
  return errorDetails;
};
