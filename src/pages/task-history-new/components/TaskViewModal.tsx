
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

  // When opening the modal, refresh the task data
  React.useEffect(() => {
    if (isOpen && task?.id) {
      console.log('[TaskViewModal] Refreshing task data for task:', task.id);
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    }
  }, [isOpen, task?.id, queryClient]);

  return (
    <TaskDetailsModal
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onRestore={onRestore}
      title="Detalhes da Tarefa"
      showRestoreButton={true}
    />
  );
};

export default TaskViewModal;
