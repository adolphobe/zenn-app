
import React, { useRef, useEffect } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';

interface TaskCommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const TaskCommentsContent: React.FC<TaskCommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  
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
    if (onCommentAdded) {
      onCommentAdded();
    }
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
