import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

// Solução radical usando div com overflow e scrollbar CSS custom
const CustomScrollArea: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => {
  return (
    <div 
      className={cn(
        "h-60 rounded-md border border-gray-200 dark:border-gray-700 overflow-auto scrollbar-custom",
        className
      )}
      style={{
        // Força scrollbar visível no Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(156, 163, 175, 0.7) transparent',
      }}
    >
      {children}
    </div>
  );
};

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments }) => {
  const { deleteComment } = useAppContext();
  
  useEffect(() => {
    // Injeta CSS diretamente no documento
    const style = document.createElement('style');
    style.innerHTML = `
      /* Estilos para scrollbar no Chrome, Edge, e Safari */
      .scrollbar-custom::-webkit-scrollbar {
        width: 10px !important;
        display: block !important;
        background: transparent !important;
      }
      
      .scrollbar-custom::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.7) !important;
        border-radius: 20px !important;
        border: 3px solid transparent !important;
      }
      
      .dark .scrollbar-custom::-webkit-scrollbar-thumb {
        background-color: rgba(107, 114, 128, 0.7) !important;
      }
      
      /* Forçar scrollbar para o Radix UI */
      [data-radix-scroll-area-scrollbar],
      [data-radix-scroll-area-scrollbar][data-orientation="vertical"],
      [data-radix-scroll-area-scrollbar][data-state="visible"] {
        opacity: 1 !important;
        visibility: visible !important;
        display: flex !important;
        width: 14px !important;
      }
      
      [data-radix-scroll-area-thumb] {
        background-color: rgba(156, 163, 175, 0.7) !important;
      }
      
      .dark [data-radix-scroll-area-thumb] {
        background-color: rgba(107, 114, 128, 0.7) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  if (!comments || comments.length === 0) {
    return null;
  }

  const handleDeleteComment = (commentId: string) => {
    if (deleteComment) {
      deleteComment(taskId, commentId);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Comentários</h4>
      
      {/* Usando uma div com overflow nativa em vez do Radix ScrollArea */}
      <CustomScrollArea>
        <div className="space-y-3 p-4">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md relative"
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">{comment.text}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                </p>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover comentário"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CustomScrollArea>
    </div>
  );
};

export default TaskComments;