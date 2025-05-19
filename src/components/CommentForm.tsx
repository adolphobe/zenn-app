
import React, { useState } from 'react';
import { useAuth } from '../context/auth';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { toast } from '@/hooks/use-toast';

interface CommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const { addComment, isSubmitting } = useComments(taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !isAuthenticated) {
      return;
    }
    
    try {
      // Use the actual comment hook instead of the action
      await addComment(text.trim(), {
        onSuccess: () => {
          setText(''); // Clear the input on success
          
          // Call the callback to refresh the comments list and scroll to bottom
          if (onCommentAdded) {
            onCommentAdded();
          }
        },
        onError: (error) => {
          console.error('Error adding comment:', error);
        }
      });
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

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
