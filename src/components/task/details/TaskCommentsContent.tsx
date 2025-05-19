
import React, { useRef, useState, useEffect } from 'react';
import { Task, Comment } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { useComments } from '@/hooks/useComments';

interface TaskCommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
  forceComments?: Comment[]; // New prop to force comments from parent
}

const TaskCommentsContent: React.FC<TaskCommentsContentProps> = ({ 
  task, 
  onCommentAdded,
  forceComments
}) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  
  // Use our comments hook to get real-time data
  const { 
    comments: hookComments, 
    refreshComments, 
    isLoading, 
    isRefetching 
  } = useComments(task.id);
  
  // Use forced comments if provided, otherwise use hook comments
  const comments = forceComments || hookComments;
  
  // Effect to scroll to bottom when comments change
  useEffect(() => {
    if (comments?.length > 0 && commentsRef.current) {
      console.log('[TaskCommentsContent] Comments updated, scrolling to bottom');
      const scrollElement = commentsRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 100);
      }
    }
  }, [comments]);
  
  // Verificar se a tarefa existe e tem um ID válido
  if (!task || !task.id) {
    return (
      <div className="text-center p-6 text-gray-500 dark:text-gray-400">
        <p>Não foi possível carregar os comentários.</p>
        <p className="text-xs mt-1">Detalhes: Tarefa inválida ou sem ID</p>
      </div>
    );
  }

  // Handler para quando um comentário é adicionado
  const handleCommentAdded = async (): Promise<void> => {
    console.log('[TaskCommentsContent] Comment added, refreshing comments');
    
    // Force comments refresh
    await refreshComments();
    
    // Call parent callback if provided
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  // Use the comments from the hook or forced comments from props
  return (
    <div ref={commentsRef}>
      <div className="mb-4">
        <h3 className="font-medium">Comentários</h3>
      </div>

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          <TaskComments 
            taskId={task.id} 
            comments={comments} 
            onCommentDeleted={handleCommentAdded}
          />
          <CommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500 dark:text-gray-400">
          <p>{isLoading || isRefetching ? "Carregando comentários..." : "Nenhum comentário para esta tarefa."}</p>
          <div className="mt-4">
            <CommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded">
          <p className="text-center">
            <a href="/#/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Faça login
            </a>
            {' '}para adicionar comentários a esta tarefa.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCommentsContent;
