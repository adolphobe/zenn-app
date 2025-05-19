import React, { useState, useEffect, useCallback } from 'react';
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
  // Track local comments state to ensure UI updates
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const queryClient = useQueryClient();
  
  // Use the comments hook directly to get real-time updates
  const { 
    comments, 
    refreshComments, 
    isLoading, 
    isRefetching 
  } = task?.id ? useComments(task.id) : { 
    comments: [], 
    refreshComments: () => Promise.resolve(),
    isLoading: false,
    isRefetching: false 
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
      
      // Refresh all related data
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      refreshComments();
    }
  }, [isOpen, task?.id, queryClient, refreshComments]);

  // Create a handler to keep task data fresh when comments are added
  const handleCommentAdded = useCallback(async () => {
    if (task?.id) {
      console.log('[TaskModal] Comment added, forcing immediate refresh');
      
      // Force immediate data refresh
      await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      
      // Explicitly refresh comments and update local state
      const refreshed = await refreshComments();
      if (refreshed) {
        setLocalComments(refreshed);
      }
    }
  }, [task?.id, queryClient, refreshComments]);

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
