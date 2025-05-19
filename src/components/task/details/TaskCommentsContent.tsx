
import React, { useRef, useEffect } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { useQueryClient } from '@tanstack/react-query';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/context/auth';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface TaskCommentsContentProps {
  task: Task;
  onCommentAdded?: () => void;
}

const TaskCommentsContent: React.FC<TaskCommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { comments, isLoading, fetchError, refreshComments } = useComments(task?.id || '');
  const { isAuthenticated, currentUser } = useAuth();
  
  // Verificação detalhada da autenticação e dados da tarefa
  useEffect(() => {
    if (task?.id) {
      console.log('[TaskCommentsContent] Task data:', {
        id: task?.id,
        hasComments: task?.comments && task.comments.length > 0,
        commentsCount: task?.comments?.length
      });
      
      console.log('[TaskCommentsContent] Auth state:', { 
        isAuthenticated, 
        hasUser: !!currentUser,
        userId: currentUser?.id 
      });
      
      // Verificação adicional da sessão do Supabase
      const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        console.log('[TaskCommentsContent] Supabase session check:', {
          hasSession: !!data.session,
          sessionUser: data.session?.user?.id || 'none',
          error: error ? JSON.stringify(error) : 'no error'
        });
      };
      
      checkSession();
    }
  }, [task, isAuthenticated, currentUser]);
  
  // Verificar se a tarefa existe e tem um ID válido
  if (!task || !task.id) {
    console.warn('[TaskCommentsContent] Task is undefined or has no ID');
    return (
      <div className="text-center p-6 text-gray-500 dark:text-gray-400">
        <p>Não foi possível carregar os comentários.</p>
        <p className="text-xs mt-1">Detalhes: Tarefa inválida ou sem ID</p>
      </div>
    );
  }

  // Usar os comentários da tarefa ou do hook, priorizando os da tarefa se disponíveis
  const taskComments = task.comments || comments;
  const hasComments = taskComments && taskComments.length > 0;
  
  // Handler para quando um comentário é adicionado
  const handleCommentAdded = (): void => {
    console.log('[TaskCommentsContent] Comment added handler called');
    
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
    console.log('[TaskCommentsContent] Comment deleted handler called');
    
    // Invalidate queries to refresh task data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
  };
  
  // Handler para forçar atualização de comentários
  const handleRefreshComments = () => {
    console.log('[TaskCommentsContent] Manual refresh requested');
    refreshComments();
    
    // Invalidate queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
  };

  if (isLoading) {
    return <div className="text-center p-4">Carregando comentários...</div>;
  }

  if (fetchError) {
    return (
      <div className="text-center p-4 text-red-500 flex flex-col items-center gap-2">
        <AlertTriangle size={24} />
        <p>Erro ao carregar comentários.</p>
        <p className="text-xs mt-1">
          {fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshComments}
          className="mt-2 flex items-center gap-1"
        >
          <RefreshCcw size={14} />
          <span>Tentar novamente</span>
        </Button>
      </div>
    );
  }

  return (
    <div ref={commentsRef}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Comentários</h3>
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
