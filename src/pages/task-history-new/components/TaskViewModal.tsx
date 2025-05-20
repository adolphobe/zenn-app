
import React from 'react';
import { Task } from '@/types';
import TaskDetailsModal from '@/components/task/TaskDetailsModal';
import { useQueryClient } from '@tanstack/react-query';

interface TaskViewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (task: Task) => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onRestore
}) => {
  const queryClient = useQueryClient();
  
  // Handler for comment updates
  const handleCommentAdded = async () => {
    if (task?.id) {
      console.log('[TaskViewModal] Comment added, refreshing data');
      
      // Invalidate relevant queries to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    }
  };

  // Handler for restore - adaptando para passar o objeto task completo
  const handleRestoreTask = () => {
    if (task) {
      onRestore(task);
    }
  };

  return (
    <TaskDetailsModal
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onRestore={handleRestoreTask}
      title="Detalhes da Tarefa"
      showRestoreButton={true}
      onCommentAdded={handleCommentAdded}
    />
  );
};

export default TaskViewModal;
