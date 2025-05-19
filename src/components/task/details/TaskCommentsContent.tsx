
import React, { useRef, useEffect, useState } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { useQueryClient } from '@tanstack/react-query';

interface TaskCommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const TaskCommentsContent: React.FC<TaskCommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [localCommentsCount, setLocalCommentsCount] = useState<number>(task?.comments?.length || 0);
  
  // Log task data for debugging
  useEffect(() => {
    console.log('[TaskCommentsContent] Task data:', {
      id: task?.id,
      hasComments: task?.comments && task.comments.length > 0,
      commentsCount: task?.comments?.length
    });
    
    // Update local count when task comments change
    setLocalCommentsCount(task?.comments?.length || 0);
  }, [task]);
  
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
  const handleCommentAdded = () => {
    console.log('[TaskCommentsContent] Comment added, calling parent callback');
    
    // Increment local counter to help UI update immediately
    setLocalCommentsCount(prev => prev + 1);
    
    // Invalidate queries to refresh task data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    
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

  return (
    <div ref={commentsRef}>
      {hasComments ? (
        <div className="space-y-4">
          <TaskComments taskId={task.id} comments={task.comments} />
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
