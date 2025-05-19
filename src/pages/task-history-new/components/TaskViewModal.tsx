import React from 'react';
import { Task } from '@/types';
import TaskDetailsModal from '@/components/task/TaskDetailsModal';
import { useQueryClient } from '@tanstack/react-query';

interface TaskViewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (taskId: string) => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onRestore
}) => {
  const queryClient = useQueryClient();

  // When opening the modal or when task changes, refresh the task data
  React.useEffect(() => {
    if (isOpen && task?.id) {
      console.log('[TaskViewModal] Refreshing task data for task:', task.id);
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    }
  }, [isOpen, task?.id, queryClient]);

  // Create a handler to keep task data fresh when comments are added
  const handleCommentAdded = () => {
    if (task?.id) {
      console.log('[TaskViewModal] Comment added, refreshing data');
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    }
  };

  return (
    <TaskDetailsModal
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onRestore={onRestore}
      title="Detalhes da Tarefa"
      showRestoreButton={true}
      onCommentAdded={handleCommentAdded}
    />
  );
};

export default TaskViewModal;
