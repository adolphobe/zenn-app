
import React, { useRef } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

interface TaskCommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const TaskCommentsContent: React.FC<TaskCommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  
  // Verificar se a tarefa existe e tem um ID válido
  if (!task || !task.id) {
    return (
      <div className="text-center p-6 text-gray-500 dark:text-gray-400">
        <p>Não foi possível carregar os comentários.</p>
        <p className="text-xs mt-1">Detalhes: Tarefa inválida ou sem ID</p>
      </div>
    );
  }

  // Usar os comentários da tarefa
  const taskComments = task.comments || [];
  const hasComments = taskComments && taskComments.length > 0;
  
  // Handler para quando um comentário é adicionado (visual only)
  const handleCommentAdded = (): void => {
    console.log('Comment added (visual feedback only)');
    
    // Call parent callback if provided
    if (onCommentAdded) {
      onCommentAdded();
    }
  };
  
  // Handler para forçar atualização de comentários (visual only)
  const handleRefreshComments = () => {
    console.log('Refresh comments clicked (visual only)');
  };

  return (
    <div ref={commentsRef}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Comentários</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshComments}
            className="flex items-center gap-1 text-xs"
          >
            <RefreshCcw size={12} />
            <span>Atualizar</span>
          </Button>
        </div>
      </div>

      {hasComments ? (
        <div className="space-y-4">
          <TaskComments 
            taskId={task.id} 
            comments={taskComments} 
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
