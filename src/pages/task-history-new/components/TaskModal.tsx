
import React from 'react';
import { Task } from '@/types';
import TaskDetailsModal from '@/components/task/TaskDetailsModal';
import { useQueryClient } from '@tanstack/react-query';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onRestore }) => {
  const queryClient = useQueryClient();
  
  // Handler for comment updates
  const handleCommentAdded = async () => {
    if (task?.id) {
      console.log('[TaskModal] Comment added, refreshing data');
      
      // Invalidate relevant queries to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
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
