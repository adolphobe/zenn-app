
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { processAuthError } from '@/utils/authErrorUtils';

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup, onForgotPassword }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuggestion, setLoginSuggestion] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if user just reset their password
  React.useEffect(() => {
    if (location.state?.passwordReset) {
      toast({
        title: "Senha redefinida com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
      });
    }
  }, [location.state]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    setLoginSuggestion(null);
    
    try {
      console.log("[LoginForm] Tentando login com:", values.email);
      console.log("[LoginForm] DETALHES EM PORTUGUÊS: Iniciando processo de autenticação para o usuário");
      
      const { success, error } = await login(values.email, values.password);
      
      if (!success) {
        console.error("[LoginForm] Falha no login para:", values.email);
        console.error("[LoginForm] DETALHES EM PORTUGUÊS: O login falhou. Verifique se o email e senha estão corretos e se a conta existe.");
        
        if (error) {
          const errorDetails = processAuthError(error);
          setLoginError(errorDetails.message);
          setLoginSuggestion(errorDetails.suggestion || null);
        } else {
          setLoginError("Usuário não encontrado ou senha incorreta. Por favor, verifique suas credenciais.");
        }
      } else {
        console.log("[LoginForm] Login bem-sucedido para:", values.email);
        console.log("[LoginForm] DETALHES EM PORTUGUÊS: Login realizado com sucesso, redirecionando automaticamente");
        
        toast({
          title: "Login realizado com sucesso",
          description: "Você foi autenticado com sucesso",
        });
        
        if (onSuccess) {
          console.log("[LoginForm] Executando callback de sucesso");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("[LoginForm] Erro de login:", error);
      console.error("[LoginForm] DETALHES EM PORTUGUÊS: Ocorreu um erro técnico durante o processo de login. Verifique a conexão com o servidor.");
      
      const errorDetails = processAuthError(error);
      setLoginError(errorDetails.message);
      setLoginSuggestion(errorDetails.suggestion || null);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Colors and icons
  const iconColor = "text-gray-800 dark:text-gray-200"; 
  const eyeIconColor = "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {loginError && (
          <Alert variant="destructive" className="py-2 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <AlertDescription className="text-sm font-medium">
                  {loginError}
                </AlertDescription>
              </div>
              {loginSuggestion && (
                <AlertDescription className="text-xs ml-6">
                  {loginSuggestion}
                </AlertDescription>
              )}
            </div>
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
            onClick={onForgotPassword}
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
          <button 
            type="button" 
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
            Criar conta
          </button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
