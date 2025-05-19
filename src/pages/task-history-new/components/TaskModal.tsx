
import React from 'react';
import { Task } from '@/types';
import TaskDetailsModal from '@/components/task/TaskDetailsModal';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (taskId: string) => void;
}

// Este componente agora simplificado, apenas utilizando o TaskDetailsModal padrão
const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onRestore }) => {
  return (
    <TaskDetailsModal
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onRestore={onRestore}
      title="Visualizar Tarefa"
      showRestoreButton={true}
    />
  );
};

export default TaskModal;
