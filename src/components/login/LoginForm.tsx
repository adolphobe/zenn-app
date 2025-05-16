
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
    
    // Simulate API call
    setTimeout(() => {
      // Set logged in state in localStorage
      localStorage.setItem('acto_is_logged_in', 'true');
      
      addToast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso",
      });
      navigate('/app/dashboard');
      setIsSubmitting(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-6 text-left">
      <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Bem vindo de volta!</h1>
      <p className="text-muted-foreground">
        Um novo dia chegou. É hora de continuar sua jornada.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="transition-all duration-300 ease-in-out hover:translate-x-1">
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    size={18}
                  />
                  <FormControl>
                    <Input
                      placeholder="E-mail"
                      className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm transition-all duration-300 "
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      className="pl-10 pr-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
              className="text-sm text-primary hover:underline hover:text-primary/80 focus:outline-none transition-colors duration-300"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <a href="#" className="text-primary hover:underline hover:text-primary/80 transition-colors duration-300">
              Criar conta
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
