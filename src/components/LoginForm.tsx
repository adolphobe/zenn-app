import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      localStorage.setItem('acto_is_logged_in', 'true');
      
      addToast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso",
      });
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Definindo uma cor escura para os ícones
  const iconColor = "text-gray-800 dark:text-gray-300"; // Um cinza bem escuro, quase preto. Ajuste o dark mode se necessário.
  const eyeIconColor = "text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200";


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
              <div className="relative">
                <Mail 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100`} // COR FORTE E OPACIDADE 100%
                  size={18}
                  // Tente também a prop color diretamente se a classe não for suficiente:
                  // color={document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#1F2937'} // Exemplo de cores hex
                />
                <FormControl>
                  <Input
                    placeholder="E-mail"
                    className="pl-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300" 
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
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} opacity-100`} // COR FORTE E OPACIDADE 100%
                  size={18}
                  // color={document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#1F2937'}
                />
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className="pl-10 pr-10 h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${eyeIconColor} opacity-100 focus:outline-none`} // COR FORTE E OPACIDADE 100%
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeClosed size={18} />
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
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