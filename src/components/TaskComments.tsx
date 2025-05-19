
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { safeParseDate } from '@/utils';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments: initialComments }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
    if (scrollContainerRef.current && initialComments.length > 0) {
      // Scroll to bottom of comments div
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [initialComments]); // Execute when comments change
  
  if (!initialComments || initialComments.length === 0) {
    return null;
  }
  
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
