import React, { useEffect } from 'react';
import { Task } from '@/types';
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
  const queryClient = useQueryClient();
  
  // Use the comments hook directly to get real-time updates
  const { refreshComments } = task?.id ? useComments(task.id) : { refreshComments: () => Promise.resolve() };

  // When opening the modal or when task changes, refresh the task data
  useEffect(() => {
    if (isOpen && task?.id) {
      console.log('[TaskModal] Refreshing task data for task:', task.id);
      
      // Refresh all related data
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      refreshComments();
    }
  }, [isOpen, task?.id, queryClient, refreshComments]);

  // Create a handler to keep task data fresh when comments are added
  const handleCommentAdded = async () => {
    if (task?.id) {
      console.log('[TaskModal] Comment added, refreshing data');
      
      // Force immediate data refresh
      await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      await refreshComments();
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
    />
  );
};

export default TaskModal;
