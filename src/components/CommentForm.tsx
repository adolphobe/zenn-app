
import React, { useState } from 'react';
import { useAuth } from '../context/auth';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { useComments } from '@/hooks/useComments';

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
    
    if (!text.trim()) {
      toast({
        title: "Comentário vazio",
        description: "Por favor, digite um comentário.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar conectado para adicionar comentários.",
        variant: "destructive"
      });
      return;
    }
    
    // Call the addComment function from our hook
    addComment(text, {
      onSuccess: () => {
        setText(''); // Clear form on success
        
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex flex-col space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Adicionar comentário..."
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          rows={3}
          disabled={isSubmitting || !isAuthenticated}
        />
        <div className="flex justify-end">
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
