import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useAppContext } from '@/context/AppContext';
import { MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CommentFormProps {
  taskId: string;
  onCommentAdded?: () => void; // Nova prop para notificar quando um comentário é adicionado
}

const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const { addComment } = useAppContext();
  
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Comment submit clicked');
    
    if (commentText.trim() && addComment) {
      addComment(taskId, commentText);
      setCommentText('');
      
      // Notificar que um comentário foi adicionado
      if (onCommentAdded) {
        onCommentAdded();
      }
      
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
  
  // Função para lidar com o pressionamento de teclas
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    
    // Verificar se a tecla Enter foi pressionada sem a tecla Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Impedir quebra de linha
      
      // Verificar se o comentário não está vazio
      if (commentText.trim() && addComment) {
        addComment(taskId, commentText);
        setCommentText('');
        
        // Notificar que um comentário foi adicionado
        if (onCommentAdded) {
          onCommentAdded();
        }
        
        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi adicionado com sucesso."
        });
        console.log('Comment added successfully via Enter key');
      }
    }
  };
  
  // Prevent all events in the comment form from bubbling up
  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Comment form container clicked, propagation stopped');
  };
  
  // Prevent mousedown in the comment form from bubbling up
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Comment form container mousedown, propagation stopped');
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
            console.log('Comment textarea clicked');
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log('Comment textarea mousedown');
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
            console.log('Comment submit button mousedown');
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