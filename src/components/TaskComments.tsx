
import React from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';

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
      <div className="space-y-3">
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
  );
};

export default TaskComments;
