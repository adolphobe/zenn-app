
import React, { useState, useEffect } from 'react';
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem('acto_is_logged_in') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

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
        title: "Faça o login abaixo:",
        description: "Login realizado com sucesso",
      });
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-950">
      {/* Left column: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 animate-fade-in">
        <div className="space-y-6 w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="text-left mb-[90px]">
            <img 
              src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/LOGO_ACTO.jpg?v=1747283022" 
              alt="Acto Logo" 
              className="w-[180px] mb-4"
            />
          </div>

          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta 👋</h1>
            <p className="text-muted-foreground">
              Um novo dia chegou. É hora de continuar sua jornada.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Mail 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                        size={18}
                      />
                      <FormControl>
                        <Input
                          placeholder="E-mail"
                          className="pl-10 h-12"
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
                  <FormItem>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Senha"
                          className="pl-10 pr-10 h-12"
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
                  className="text-sm text-primary hover:underline focus:outline-none"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <a href="#" className="text-primary hover:underline">
                  Criar conta
                </a>
              </div>
            </form>
          </Form>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Acto. Todos os direitos reservados.
        </div>
      </div>

      {/* Right column: Image */}
      <div className="hidden md:block md:w-1/2 bg-primary/5">
        <div className="h-full w-full relative">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://img.freepik.com/fotos-gratis/copo-de-agua-com-sombras_23-2150701849.jpg?t=st=1747283331~exp=1747286931~hmac=34c5470984073a35ee91759495d76cacc2596d43e03eb51d07b5beeae02a5a15&w=2000"
              alt="Fundo de login"
              className="object-cover w-full h-full object-center"
              style={{ minWidth: '100%', minHeight: '100%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent mix-blend-multiply" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
