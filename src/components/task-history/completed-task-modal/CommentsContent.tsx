
import React, { useRef } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { useQueryClient } from '@tanstack/react-query';

interface CommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const CommentsContent: React.FC<CommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  
  // Verificar se a tarefa existe e tem um ID válido
  if (!task || !task.id) {
    return (
      <div className="text-center p-6 text-gray-500 dark:text-gray-400">
        <p>Não foi possível carregar os comentários.</p>
      </div>
    );
  }

  const hasComments = task.comments && task.comments.length > 0;
  
  // Handler para quando um comentário é adicionado
  const handleCommentAdded = (): void => {
    console.log('[CommentsContent] Comment added');
    
    // Invalidate queries to refresh task data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
    
    if (onCommentAdded) {
      onCommentAdded();
    }
  };
  
  // Handler para quando um comentário é excluído
  const handleCommentDeleted = (): void => {
    console.log('[CommentsContent] Comment deleted');
    
    // Invalidate queries to refresh task data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
  };

  return (
    <div ref={commentsContainerRef} className="space-y-4">
      {hasComments && (
        <TaskComments 
          taskId={task.id} 
          comments={task.comments}
          onCommentDeleted={handleCommentDeleted} 
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
