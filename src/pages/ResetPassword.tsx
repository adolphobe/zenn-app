
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { InvalidTokenMessage } from '@/components/auth/InvalidTokenMessage';
import { supabase } from '@/integrations/supabase/client';

/**
 * Página de redefinição de senha
 * Gerencia o fluxo de verificação do token e redefinição de senha
 */
const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  // Verifica o token de redefinição de senha na URL
  useEffect(() => {
    async function verifyResetToken() {
      console.log("[ResetPassword] Verificando token de redefinição");
      console.log("[ResetPassword] DETALHES EM PORTUGUÊS: Verificando se o token de redefinição está presente na URL");
      
      // Verifica se há um code nos parâmetros da URL
      const codeFromQueryParam = searchParams.get('code');
      
      // Verifica se há um token no hash da URL (outro formato possível)
      const hash = window.location.hash;
      
      // Se não houver token de nenhuma forma, mostrar erro
      if (!(hash && hash.includes('access_token')) && !codeFromQueryParam) {
        console.error("[ResetPassword] Nenhum token encontrado na URL");
        console.error("[ResetPassword] DETALHES EM PORTUGUÊS: URL não contém um token válido para redefinição de senha");
        setResetError("Link de redefinição inválido ou ausente. Solicite um novo link na página de login.");
        setIsLoading(false);
        return;
      }
      
      try {
        // Usa getSession() para automaticamente processar o token da URL
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[ResetPassword] Erro ao processar sessão:", sessionError);
          console.error("[ResetPassword] DETALHES EM PORTUGUÊS: Não foi possível validar o token de redefinição");
          setResetError("Link de redefinição inválido ou expirado. Solicite um novo link.");
          setIsLoading(false);
          return;
        }
        
        // Verifica se há uma sessão válida
        if (!sessionData.session) {
          console.error("[ResetPassword] Sessão não encontrada após processar URL");
          console.error("[ResetPassword] DETALHES EM PORTUGUÊS: O token de redefinição não gerou uma sessão válida");
          setResetError("Link de redefinição inválido ou expirado. Solicite um novo link.");
          setIsLoading(false);
          return;
        }
        
        // Se chegou aqui, temos uma sessão válida
        console.log("[ResetPassword] Sessão válida estabelecida com sucesso");
        console.log("[ResetPassword] DETALHES EM PORTUGUÊS: Token de redefinição validado com sucesso");
        
        // Armazena o email da sessão para exibir ao usuário
        setEmail(sessionData.session.user?.email || null);
        setHasToken(true);
        setIsLoading(false);
      } catch (error) {
        console.error("[ResetPassword] Erro ao processar token:", error);
        console.error("[ResetPassword] DETALHES EM PORTUGUÊS: Ocorreu um erro ao tentar processar o link de redefinição");
        setResetError("Ocorreu um erro ao processar seu link de redefinição. Por favor, tente novamente.");
        setIsLoading(false);
      }
    }
    
    verifyResetToken();
  }, [searchParams]);

  const handleResetSuccess = () => {
    setResetSuccess("Sua senha foi redefinida com sucesso!");
  };
  
  const goToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300">
        <div className="text-left mb-8">
          <img 
            src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-8.jpg?v=1747284016" 
            alt="Acto Logo" 
            className="w-[120px] mb-6"
          />
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Redefinir Senha
          </h1>
          <p className="text-muted-foreground mt-2">
            {resetSuccess 
              ? "Sua senha foi redefinida com sucesso."
              : email 
                ? `Defina uma nova senha para ${email}`
                : "Defina sua nova senha para acessar sua conta."}
          </p>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            <p>Verificando link de redefinição...</p>
          </div>
        ) : resetError ? (
          <InvalidTokenMessage message={resetError} />
        ) : hasToken && (
          <PasswordResetForm 
            email={email} 
            onSuccess={handleResetSuccess} 
          />
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={goToLogin}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
