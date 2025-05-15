
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAppContext } from '@/context/AppContext';
import { MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CommentFormProps {
  taskId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId }) => {
  const [commentText, setCommentText] = useState('');
  const { addComment } = useAppContext();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Comment submit clicked');
    
    if (commentText.trim() && addComment) {
      addComment(taskId, commentText);
      setCommentText('');
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso."
      });
      console.log('Comment added successfully');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    setCommentText(e.target.value);
  };

  // Prevent clicks inside the comment form from closing the modal
  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Comment form container clicked, propagation stopped');
  };

  return (
    <div className="mt-4" onClick={handleContainerClick}>
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        Adicionar comentário
      </h4>
      <div className="flex flex-col space-y-2">
        <textarea
          value={commentText}
          onChange={handleTextChange}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Comment textarea clicked');
          }}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          placeholder="Escreva seu comentário..."
          rows={3}
        />
        <Button 
          type="button"
          disabled={!commentText.trim()}
          size="sm"
          className="self-end flex items-center gap-1"
          onClick={handleSubmit}
        >
          <MessageSquare size={16} />
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
