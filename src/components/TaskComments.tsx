
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { X } from 'lucide-react';
import { safeParseDate } from '@/utils';
import { useComments } from '@/hooks/useComments';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onCommentDeleted?: () => void; 
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments: initialComments, onCommentDeleted }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { comments: hookComments, deleteComment } = useComments(taskId);
  
  // Use either the props comments or the data from the hook, with props taking precedence
  const displayComments = initialComments.length > 0 ? initialComments : hookComments;
  
  // Add global CSS for scrollbar
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    const styleId = 'native-scrollbar-styles';
    
    // Check if it already exists
    if (!document.getElementById(styleId)) {
      style.id = styleId;
      style.innerHTML = `
        /* Customization for scrollbar in Chrome, Edge and Safari */
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
        
        /* Customization for scrollbar in Firefox */
        .native-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.7) transparent;
        }
        
        /* Style for dark theme */
        .dark .native-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(209, 213, 219, 0.5);
        }
        
        .dark .native-scrollbar {
          scrollbar-color: rgba(209, 213, 219, 0.5) transparent;
        }
      `;
      
      // Add to head
      document.head.appendChild(style);
    }
    
    // No need to clean up, we want the style to remain.
  }, []);
  
  // Effect to scroll to bottom whenever comments change
  useEffect(() => {
    if (scrollContainerRef.current && displayComments.length > 0) {
      // Scroll to bottom of comments div
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [displayComments]); // Execute when comments change
  
  if (!displayComments || displayComments.length === 0) {
    return null;
  }
  
  const handleDeleteComment = async (commentId: string) => {
    console.log('[TaskComments] Deleting comment:', commentId);
    
    // Usando a função deleteComment com os callbacks corretos
    deleteComment(commentId, {
      onSuccess: () => {
        console.log('[TaskComments] Comment deleted successfully');
        // Call the callback since we're in the success handler
        if (onCommentDeleted) {
          console.log('[TaskComments] Calling onCommentDeleted callback');
          onCommentDeleted();
        }
      },
      onError: (error) => {
        console.error('[TaskComments] Error deleting comment:', error);
      }
    });
  };
  
  // Prevent click event propagation
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Safe function to format dates
  const formatCommentDate = (dateString: string) => {
    try {
      // Convert string to Date object
      const parsedDate = safeParseDate(dateString);
      
      // If date is invalid, return fallback text
      if (!parsedDate) {
        return 'Data indisponível';
      }
      
      // Format valid date
      return format(parsedDate, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Data indisponível';
    }
  };
  
  return (
    <div className="mt-4 cursor-default" onClick={handleContainerClick}>
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Comentários</h4>
      
      {/* Div with native scrollbar and styling */}
      <div 
        ref={scrollContainerRef}
        className="native-scrollbar h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-default"
        onClick={handleContainerClick}
      >
        <div className="space-y-3 p-4">
          {displayComments.map(comment => (
            <div 
              key={comment.id} 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md relative"
              onClick={handleContainerClick}
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">{comment.text}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {formatCommentDate(comment.createdAt)}
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remover comentário"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <X size={14} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent 
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                        Confirmar exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        Tem certeza que deseja excluir este comentário?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="bg-gray-50 hover:bg-gray-200 text-gray-700 hover:text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-gray-200 border-gray-200 dark:border-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComment(comment.id);
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
