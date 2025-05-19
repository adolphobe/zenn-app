
import React, { useRef } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';

interface CommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const CommentsContent: React.FC<CommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Verificar se a tarefa existe e tem um ID válido
  if (!task || !task.id) {
    return (
      <div className="text-center p-6 text-gray-500 dark:text-gray-400">
        <p>Não foi possível carregar os comentários.</p>
      </div>
    );
  }

  const hasComments = task.comments && task.comments.length > 0;
  
  // Handler for visual feedback only
  const handleCommentAdded = (): void => {
    console.log('Comment form submitted (visual only)');
    
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  return (
    <div ref={commentsContainerRef} className="space-y-4">
      {hasComments && (
        <TaskComments 
          taskId={task.id} 
          comments={task.comments}
        />
      )}
      <CommentForm 
        taskId={task.id}
        onCommentAdded={handleCommentAdded} 
      />
    </div>
  );
};

export default CommentsContent;
