
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
  const [loaded, setLoaded] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem('acto_is_logged_in') === 'true') {
      navigate('/dashboard');
    }
    
    // Set loaded state for animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso",
      });
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Animated floating items for the background with random positions and continuous animations
  const floatingItems = Array(7).fill(null).map((_, i) => (
    <div 
      className="absolute rounded-full animated-float"
      style={{
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 6 + 6}s`,
        opacity: Math.random() * 0.4 + 0.3,
      }}
    />
  ));

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Animated floating background elements */}
      <style>
        {`
        @keyframes float-animate {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -20px) scale(1.05);
            opacity: 0.5;
          }
          50% {
            transform: translate(40px, 10px) scale(1);
            opacity: 0.7;
          }
          75% {
            transform: translate(20px, 30px) scale(0.95);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
        }
        
        .animated-float {
            animation: float-animate ease-in-out infinite alternate;
        }
      `}
      </style>
      
      {floatingItems}
      
      {/* Left column: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 z-10">
        <div className={`space-y-6 w-full max-w-md mx-auto transition-all duration-1000 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          {/* Logo */}
          <div className="text-left mb-12">
            <img 
              src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-8.jpg?v=1747284016" 
              alt="Acto Logo" 
              className="w-[120px] mb-4"
            />
          </div>

          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Bem vindo de volta!</h1>
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
                className="w-full h-12 text-base transition-all duration-300 transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <a href="#" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-300">
                  Criar conta
                </a>
              </div>
            </form>
          </Form>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground opacity-70">
          © {new Date().getFullYear()} Acto. Todos os direitos reservados.
        </div>
      </div>

      {/* Right column: Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1595131264264-377ba3b61f46?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fundo de login"
            className="object-cover w-full h-full object-center"
            style={{ minWidth: '100%', minHeight: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/20 mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
};

export default Login;
