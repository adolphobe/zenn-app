
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAppContext } from '@/context/AppContext';
import { MessageSquare } from 'lucide-react';

interface CommentFormProps {
  taskId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId }) => {
  const [commentText, setCommentText] = useState('');
  const { addComment } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim() && addComment) {
      addComment(taskId, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        Adicionar comentário
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Escreva seu comentário..."
            rows={3}
          />
          <Button 
            type="submit"
            disabled={!commentText.trim()}
            size="sm"
            className="self-end flex items-center gap-1"
          >
            <MessageSquare size={16} />
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
