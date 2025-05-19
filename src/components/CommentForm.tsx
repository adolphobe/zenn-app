
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAppContext } from '@/context/AppContext';
import { MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const { addComment } = useAppContext();
  
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (commentText.trim() && addComment) {
      addComment(taskId, commentText);
      setCommentText('');
      
      // Notify the parent component that a comment was added
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso."
      });
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    setCommentText(e.target.value);
  };
  
  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    
    // Check if Enter was pressed without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent line break
      
      // Check if the comment is not empty
      if (commentText.trim() && addComment) {
        addComment(taskId, commentText);
        setCommentText('');
        
        // Notify the parent component that a comment was added
        if (onCommentAdded) {
          onCommentAdded();
        }
        
        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi adicionado com sucesso."
        });
      }
    }
  };
  
  // Prevent all events in the comment form from bubbling up
  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Prevent mousedown in the comment form from bubbling up
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="mt-4" 
      onClick={handleContainerClick}
      onMouseDown={handleContainerMouseDown}
    >
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        Adicionar comentário
      </h4>
      <div 
        className="flex flex-col space-y-2"
        onClick={handleContainerClick}
        onMouseDown={handleContainerMouseDown}
      >
        <textarea
          value={commentText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          placeholder="Escreva seu comentário e pressione Enter para enviar..."
          rows={3}
        />
        <Button 
          type="button"
          disabled={!commentText.trim()}
          size="sm"
          className="self-end flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600"
          onClick={handleSubmit}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
          <MessageSquare size={16} />
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
