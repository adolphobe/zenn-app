// TaskComments.tsx com styled-jsx
import React from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments }) => {
  const { deleteComment } = useAppContext();
  
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
      
      <AlwaysVisibleScrollArea className="h-60 rounded-md border border-gray-200 dark:border-gray-700">
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
      </AlwaysVisibleScrollArea>
      
      {/* Estilos globais para forçar a visibilidade da scrollbar */}
      <style jsx global>{`
        /* Forçar scrollbar sempre visível */
        [data-radix-scroll-area-scrollbar],
        [data-radix-scroll-area-scrollbar][data-orientation="vertical"],
        [data-radix-scroll-area-scrollbar][data-state] {
          opacity: 1 !important;
          visibility: visible !important;
          display: flex !important;
          transition: none !important;
        }
        
        [data-radix-scroll-area-thumb] {
          background-color: rgba(156, 163, 175, 0.7) !important;
        }
        
        .dark [data-radix-scroll-area-thumb] {
          background-color: rgba(209, 213, 219, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default TaskComments;