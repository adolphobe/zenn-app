
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { useComments } from '@/hooks/useComments';
import { AlertCircle } from 'lucide-react';
import { logComment } from '@/utils/commentLogger';

interface CommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const { addComment, isSubmitting } = useComments(taskId);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Log inicial ao montar o componente
  useEffect(() => {
    logComment.render('CommentForm', { 
      taskId, 
      authState: { isAuthenticated, userId: currentUser?.id } 
    });
  }, []);
  
  // Verificação detalhada do status de autenticação
  useEffect(() => {
    logComment.authCheck(isAuthenticated, currentUser?.id);
    
    // Verificar a presença do token no localStorage
    const hasToken = !!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
    logComment.api.response('authTokenCheck', {
      hasTokenInLocalStorage: hasToken,
      tokenValue: hasToken ? '[REDACTED FOR SECURITY]' : 'none'
    });
    
    setAuthChecked(true);
  }, [isAuthenticated, currentUser, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      logComment.validation('Tentativa de enviar comentário vazio');
      
      toast({
        title: "Comentário vazio",
        description: "Por favor, digite um comentário.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isAuthenticated || !currentUser) {
      logComment.authError('Tentativa de comentar sem estar autenticado');
      
      // Verificar detalhes da sessão para diagnóstico
      const sessionToken = localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
      logComment.api.response('sessionCheck', { 
        sessionExists: sessionToken ? 'yes' : 'no',
        isAuthenticated, 
        hasUser: !!currentUser
      });
      
      toast({
        title: "Não autenticado",
        description: "Você precisa estar conectado para adicionar comentários.",
        variant: "destructive"
      });
      return;
    }
    
    logComment.attempt(taskId, text, currentUser.id);
    
    // Usando a versão aprimorada da função addComment com mais detalhes de erro
    addComment(text, {
      onSuccess: () => {
        logComment.success(taskId, 'form-success');
        setText(''); // Limpar o formulário em caso de sucesso
        
        if (onCommentAdded) {
          logComment.info('COMMENT_CALLBACK', 'Chamando callback onCommentAdded');
          onCommentAdded();
        }
      },
      onError: (error) => {
        logComment.error('Erro na chamada addComment do formulário', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        
        // Toast mais detalhado para erros
        toast({
          title: "Erro ao adicionar comentário",
          description: `Não foi possível adicionar o comentário: ${errorMessage}`,
          variant: "destructive"
        });
      }
    });
  };

  if (!authChecked) {
    logComment.info('COMMENT_RENDER', 'Aguardando verificação de autenticação');
    return <div className="text-center p-2">Verificando autenticação...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {!isAuthenticated && (
        <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Você precisa estar conectado para comentar.</span>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAuthenticated ? "Adicionar comentário..." : "Faça login para comentar"}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          rows={3}
          disabled={isSubmitting || !isAuthenticated}
        />
        <div className="flex justify-between">
          <div className="text-xs text-gray-500">
            {isAuthenticated ? (
              <span>Comentando como: {currentUser?.email || 'Usuário autenticado'}</span>
            ) : (
              <a href="/#/login" className="text-blue-500 hover:underline">Faça login para comentar</a>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!text.trim() || isSubmitting || !isAuthenticated}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {isSubmitting ? "Enviando..." : "Comentar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
