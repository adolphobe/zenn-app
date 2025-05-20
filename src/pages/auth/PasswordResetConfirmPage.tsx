
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InvalidTokenMessage } from '@/components/auth/InvalidTokenMessage';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

const PasswordResetConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Get email from query parameters
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);
  
  const handleResetSuccess = () => {
    setResetSuccess("Sua senha foi redefinida com sucesso!");
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };
  
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
            Confirmar Redefinição
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
        ) : (
          <PasswordResetForm 
            email={email} 
            onSuccess={handleResetSuccess} 
          />
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirmPage;
