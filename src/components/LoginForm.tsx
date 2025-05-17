
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, AlertTriangle, WifiOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/auth/useAuth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthErrorType } from '@/auth/AuthContext';

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, authError, clearAuthError, pendingLoginState, resumePendingLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Exibe mensagens de erro com base no tipo de erro de autenticação
  useEffect(() => {
    if (authError) {
      switch (authError) {
        case 'invalid_credentials':
          setLoginError("E-mail ou senha incorretos. Por favor, tente novamente.");
          break;
        case 'connection_lost':
          setLoginError("Conexão perdida durante o login. Tente novamente.");
          break;
        case 'session_expired':
          setLoginError("Sua sessão expirou. Por favor, faça login novamente.");
          break;
        default:
          setLoginError("Ocorreu um erro durante o login. Por favor, tente novamente.");
      }
    } else {
      setLoginError(null);
    }
  }, [authError]);

  const onSubmit = async (values: LoginFormValues) => {
    clearAuthError(); // Limpa erros anteriores
    const success = await login(values.email, values.password);
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      }
    }
    // Não precisamos definir erro aqui pois o AuthProvider já cuida disso
  };

  // Função para retomar um login pendente
  const handleResumePendingLogin = async () => {
    const success = await resumePendingLogin();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Obtém o ícone e cor com base no tipo de erro
  const getErrorIconAndColor = () => {
    switch (authError) {
      case 'connection_lost':
        return { icon: <WifiOff size={16} />, colorClass: 'text-amber-600 dark:text-amber-400' };
      case 'session_expired':
        return { icon: <AlertTriangle size={16} />, colorClass: 'text-amber-600 dark:text-amber-400' };
      default:
        return { icon: <AlertCircle size={16} />, colorClass: 'text-red-600 dark:text-red-400' };
    }
  };

  // Vamos usar uma cor bem contrastante para garantir que, uma vez visível, ele seja notado.
  const iconColor = "text-gray-800 dark:text-gray-200"; 
  const eyeIconColor = "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100";
  
  const { icon: errorIcon, colorClass: errorColorClass } = getErrorIconAndColor();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {loginError && (
          <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 py-2 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className={`flex items-center gap-2 ${errorColorClass}`}>
              {errorIcon}
              <AlertDescription className="text-sm font-medium">
                {loginError}
              </AlertDescription>
            </div>
            
            {authError === 'connection_lost' && pendingLoginState && (
              <div className="mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full text-sm"
                  onClick={handleResumePendingLogin}
                >
                  Tentar recuperar sessão
                </Button>
              </div>
            )}
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
              <div className="relative flex items-center"> 
                <Mail 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100 z-20`}
                  size={18}
                />
                <FormControl>
                  <Input
                    placeholder="E-mail"
                    className="pl-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full" 
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
              <div className="relative flex items-center"> 
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100 z-20`}
                  size={18}
                />
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className="pl-10 pr-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300 w-full"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${eyeIconColor} opacity-100 focus:outline-none z-20`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <button 
            type="button"
            className="text-sm text-blue-600 hover:underline hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none transition-colors duration-300"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground dark:text-gray-400">Não tem uma conta? </span>
          <a href="#" className="text-blue-600 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
            Criar conta
          </a>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
