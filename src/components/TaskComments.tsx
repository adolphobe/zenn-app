import React from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

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
      
      {/* Div com scrollbar nativa e estilização */}
      <div className="native-scrollbar h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
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
      </div>
      
      {/* Estilos para a scrollbar nativa */}
      <style jsx global>{`
        /* Personalização da scrollbar para Chrome, Edge e Safari */
        .native-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          display: block !important;
        }
        
        .native-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .native-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.7);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        .native-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.9);
        }
        
        /* Personalização da scrollbar para Firefox */
        .native-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.7) transparent;
        }
        
        /* Estilo para tema escuro */
        .dark .native-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(209, 213, 219, 0.5);
        }
        
        .dark .native-scrollbar {
          scrollbar-color: rgba(209, 213, 219, 0.5) transparent;
        }
      `}</style>
    </div>
  );
};

export default TaskComments;