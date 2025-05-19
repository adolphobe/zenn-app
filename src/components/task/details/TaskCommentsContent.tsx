
import React, { useRef, useEffect } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { useQueryClient } from '@tanstack/react-query';
import { useComments } from '@/hooks/useComments';

interface TaskCommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const TaskCommentsContent: React.FC<TaskCommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { comments } = useComments(task?.id || '');
  
  // Log task data for debugging
  useEffect(() => {
    if (task?.id) {
      console.log('[TaskCommentsContent] Task data:', {
        id: task?.id,
        hasComments: task?.comments && task.comments.length > 0,
        commentsCount: task?.comments?.length
      });
    }
  }, [task]);
  
  // Verificar se a tarefa existe e tem um ID válido
  if (!task || !task.id) {
    return (
      <div className="text-center p-6 text-gray-500 dark:text-gray-400">
        <p>Não foi possível carregar os comentários.</p>
      </div>
    );
  }

  const taskComments = task.comments || comments;
  const hasComments = taskComments && taskComments.length > 0;
  
  // Handler para quando um comentário é adicionado
  const handleCommentAdded = (): void => {
    // Invalidate queries to refresh task data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
    
    // Call parent callback if provided
    if (onCommentAdded) {
      onCommentAdded();
    }
    
    // Scroll to bottom after a small delay to ensure DOM update
    setTimeout(() => {
      if (commentsRef.current) {
        const scrollElement = commentsRef.current.querySelector('.native-scrollbar');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
          console.log('[TaskCommentsContent] Scrolled to bottom after adding comment');
        }
      }
    }, 200);
  };
  
  // Handler para quando um comentário é removido
  const handleCommentDeleted = (): void => {
    // Invalidate queries to refresh task data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
  };

  return (
    <div ref={commentsRef}>
      {hasComments ? (
        <div className="space-y-4">
          <TaskComments 
            taskId={task.id} 
            comments={taskComments} 
            onCommentDeleted={handleCommentDeleted}
          />
          <CommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500 dark:text-gray-400">
          <p>Nenhum comentário para esta tarefa.</p>
          <div className="mt-4">
            <CommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCommentsContent;
