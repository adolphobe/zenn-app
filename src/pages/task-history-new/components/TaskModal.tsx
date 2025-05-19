
import React, { useState, useEffect } from 'react';
import { Task, Comment } from '@/types';
import TaskDetailsModal from '@/components/task/TaskDetailsModal';
import { useQueryClient } from '@tanstack/react-query';
import { useComments } from '@/hooks/useComments';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (taskId: string) => void;
}

// Este componente agora simplificado, apenas utilizando o TaskDetailsModal padrão
const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onRestore }) => {
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const queryClient = useQueryClient();
  
  // Use the comments hook only if we have a task
  const { 
    comments, 
    refreshComments
  } = task?.id ? useComments(task.id) : { 
    comments: [], 
    refreshComments: () => Promise.resolve()
  };
  
  // Update local comments whenever the hook comments change
  useEffect(() => {
    if (comments) {
      console.log('[TaskModal] Received updated comments:', comments.length);
      setLocalComments(comments);
    }
  }, [comments]);

  // When opening the modal or when task changes, refresh the task data
  useEffect(() => {
    if (isOpen && task?.id) {
      console.log('[TaskModal] Modal opened, refreshing task data for task:', task.id);
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    }
  }, [isOpen, task?.id, queryClient]);

  // Handler for when a comment is added
  const handleCommentAdded = async () => {
    if (task?.id) {
      console.log('[TaskModal] Comment added, refreshing comments');
      
      try {
        // Invalidate the queries
        await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
        await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
        
        // Get fresh comments data
        await refreshComments();
      } catch (error) {
        console.error('[TaskModal] Error refreshing comments:', error);
      }
    }
  };

  return (
    <TaskDetailsModal
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onRestore={onRestore}
      title="Visualizar Tarefa"
      showRestoreButton={true}
      onCommentAdded={handleCommentAdded}
      forceComments={localComments}
    />
  );
};

export default TaskModal;
