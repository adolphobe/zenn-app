
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { safeParseDate } from '@/utils';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth';
import { useComments } from '@/hooks/useComments';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onCommentDeleted?: () => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments: initialComments, onCommentDeleted }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { deleteComment } = useComments(taskId);
  const { currentUser } = useAuth();
  
  // Log component props for debugging
  console.log('[TaskComments] Props:', { taskId, initialComments, currentUser });
  console.log('[TaskComments] Comments count:', initialComments?.length);
  
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
  }, []);
  
  // Effect to scroll to bottom whenever comments change
  useEffect(() => {
    if (scrollContainerRef.current && initialComments?.length > 0) {
      console.log('[TaskComments] Scrolling to bottom, comments length:', initialComments.length);
      // Scroll to bottom of comments div with a slight delay to ensure rendering
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [initialComments]); // Execute when comments change
  
  if (!initialComments || initialComments.length === 0) {
    console.log('[TaskComments] No comments to display');
    return null;
  }
  
  // Prevent click event propagation
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handle comment deletion
  const handleDeleteComment = async (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
    
    console.log('[TaskComments] Deleting comment:', commentId);
    await deleteComment(commentId, {
      onSuccess: () => {
        console.log('[TaskComments] Comment deleted, calling onCommentDeleted callback');
        if (onCommentDeleted) {
          onCommentDeleted();
        }
      }
    });
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
  
  // Check if user can delete a comment
  const canUserDeleteComment = (comment: Comment) => {
    // Using userId from Comment interface
    const canDelete = currentUser && currentUser.id === comment.userId;
    console.log('[TaskComments] Can user delete comment?', canDelete, 'comment:', comment, 'currentUser:', currentUser?.id);
    return canDelete;
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
          {initialComments.map(comment => (
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
                {canUserDeleteComment(comment) && (
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                    onClick={(e) => handleDeleteComment(comment.id, e)}
                  >
                    <Trash2 size={14} />
                    <span className="sr-only">Excluir comentário</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
