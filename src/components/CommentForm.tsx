
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { useComments } from '@/hooks/useComments';
import { AlertCircle } from 'lucide-react';

interface CommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const { addComment, isSubmitting } = useComments(taskId);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Verificação detalhada do status de autenticação
  useEffect(() => {
    console.log('[CommentForm] Auth status:', { 
      isAuthenticated, 
      hasUser: !!currentUser,
      userId: currentUser?.id,
      taskId: taskId
    });
    setAuthChecked(true);
  }, [isAuthenticated, currentUser, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Comentário vazio",
        description: "Por favor, digite um comentário.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isAuthenticated || !currentUser) {
      console.error('[CommentForm] User not authenticated:', { 
        isAuthenticated, 
        currentUser,
        sessionExists: localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token') ? 'yes' : 'no'
      });
      
      toast({
        title: "Não autenticado",
        description: "Você precisa estar conectado para adicionar comentários.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('[CommentForm] Submitting comment with detailed data:', { 
      taskId, 
      userId: currentUser.id, 
      text,
      textLength: text.length,
      isAuthenticated
    });
    
    // Usando a versão aprimorada da função addComment com mais detalhes de erro
    addComment(text, {
      onSuccess: () => {
        console.log('[CommentForm] Comment added successfully');
        setText(''); // Limpar o formulário em caso de sucesso
        
        if (onCommentAdded) {
          console.log('[CommentForm] Calling onCommentDeleted callback');
          onCommentAdded();
        }
      },
      onError: (error) => {
        console.error('[CommentForm] Error adding comment:', error);
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
