
import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { safeParseDate } from '@/utils';
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

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments, onCommentDeleted }) => {
  const { deleteComment } = useAppContext();
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  
  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  
  // Add more detailed logging for debugging
  useEffect(() => {
    console.log(`[TaskComments] Rendering ${localComments.length} comments for task ${taskId}`);
    localComments.forEach((comment, index) => {
      console.log(`[TaskComments] Comment ${index}:`, {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        userId: comment.userId
      });
    });
  }, [localComments, taskId]);
  
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
      console.log('[TaskComments] Added scrollbar styles');
    }
    
    // No need to clean up, we want the style to remain.
  }, []);
  
  // Effect to scroll to bottom whenever comments change
  useEffect(() => {
    if (scrollContainerRef.current && localComments.length > 0) {
      // Scroll to bottom of comments div
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      console.log('[TaskComments] Scrolled to bottom of comments container');
    }
  }, [localComments]); // Execute when comments change
  
  if (!localComments || localComments.length === 0) {
    console.log('[TaskComments] No comments to display');
    return null;
  }
  
  const handleDeleteComment = async (commentId: string) => {
    if (deleteComment) {
      console.log(`[TaskComments] Deleting comment ${commentId} for task ${taskId}`);
      
      // Update local state immediately for instant UI feedback
      setLocalComments(prev => prev.filter(comment => comment.id !== commentId));
      
      try {
        // Delete from database and global state - properly awaiting the promise
        const success = await deleteComment(taskId, commentId);
        
        if (success) {
          // Notify parent component that a comment was deleted
          if (onCommentDeleted) {
            console.log('[TaskComments] Calling onCommentDeleted callback');
            onCommentDeleted();
          }
        } else {
          // If deletion failed in the backend, restore the comment in the UI
          console.log('[TaskComments] Comment deletion failed, restoring in UI');
          const deletedComment = comments.find(c => c.id === commentId);
          if (deletedComment) {
            setLocalComments(prev => [...prev, deletedComment]);
          }
        }
      } catch (error) {
        console.error('[TaskComments] Error deleting comment:', error);
        // Restore the comment in the UI since deletion failed
        const deletedComment = comments.find(c => c.id === commentId);
        if (deletedComment) {
          setLocalComments(prev => [...prev, deletedComment]);
        }
      }
      
      setCommentToDelete(null);
    }
  };
  
  // Prevent click event propagation
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Prevent mousedown in the comment form from bubbling up
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Safe function to format dates
  const formatCommentDate = (dateString: string) => {
    try {
      // Convert string to Date object
      const parsedDate = safeParseDate(dateString);
      
      // If date is invalid, return fallback text
      if (!parsedDate) {
        console.warn('[TaskComments] Invalid comment date encountered:', dateString);
        return 'Data indisponível';
      }
      
      // Format valid date
      return format(parsedDate, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('[TaskComments] Error formatting comment date:', error, dateString);
      return 'Data indisponível';
    }
  };
  
  return (
    <div className="mt-4 cursor-default" onClick={handleContainerClick}>
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Comentários</h4>
      
      {/* Div with native scrollbar and styling, now with ref and onClick to avoid propagation */}
      <div 
        ref={scrollContainerRef}
        className="native-scrollbar h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-default"
        onClick={handleContainerClick}
      >
        <div className="space-y-3 p-4">
          {localComments.map(comment => (
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
