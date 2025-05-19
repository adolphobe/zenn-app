
import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/auth';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from '@tanstack/react-query';

interface CommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const { addComment, isSubmitting } = useComments(taskId);
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Melhor validação para handling de strings e números
    const trimmedText = String(text).trim();
    console.log('[CommentForm] Texto após trim:', trimmedText, 'Comprimento:', trimmedText.length);
    
    if (trimmedText.length === 0 || !isAuthenticated) {
      console.log('[CommentForm] Submit prevented: empty text or not authenticated');
      return;
    }
    
    try {
      console.log('[CommentForm] Submitting comment:', trimmedText, 'for taskId:', taskId);
      
      if (!taskId) {
        console.error('[CommentForm] Cannot add comment: Task ID is missing');
        toast({
          id: uuidv4(),
          title: "Erro ao adicionar comentário",
          description: "ID da tarefa não encontrado.",
          variant: "destructive",
        });
        return;
      }
      
      if (!currentUser?.id) {
        console.error('[CommentForm] Cannot add comment: User ID is missing');
        toast({
          id: uuidv4(),
          title: "Erro ao adicionar comentário",
          description: "Você precisa estar autenticado para comentar.",
          variant: "destructive",
        });
        return;
      }
      
      // Use the actual comment hook instead of the action
      await addComment(trimmedText, {
        onSuccess: async () => {
          console.log('[CommentForm] Comment added successfully');
          setText(''); // Clear the input on success
          
          // Force immediate refresh of ALL relevant queries without refetchType parameter
          await Promise.all([
            queryClient.invalidateQueries({ 
              queryKey: ['comments', taskId]
            }),
            queryClient.invalidateQueries({ 
              queryKey: ['task', taskId]
            }),
            queryClient.invalidateQueries({ 
              queryKey: ['tasks']
            }),
            queryClient.invalidateQueries({ 
              queryKey: ['completedTasks']
            })
          ]);
          
          // Explicitly fetch fresh comments data
          await queryClient.fetchQuery({ 
            queryKey: ['comments', taskId]
          });
          
          // Call the callback to refresh the comments list and scroll to bottom
          if (onCommentAdded) {
            console.log('[CommentForm] Calling onCommentAdded callback');
            onCommentAdded();
          }
        },
        onError: (error) => {
          console.error('[CommentForm] Error adding comment:', error);
          toast({
            id: uuidv4(),
            title: "Erro ao adicionar comentário",
            description: "Ocorreu um erro ao adicionar seu comentário. Por favor, tente novamente.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error('[CommentForm] Error in form submission:', error);
      toast({
        id: uuidv4(),
        title: "Erro no formulário",
        description: "Ocorreu um erro ao processar seu comentário. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [text, isAuthenticated, taskId, addComment, onCommentAdded, currentUser, queryClient]);

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
            disabled={String(text).trim().length === 0 || isSubmitting || !isAuthenticated}
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
