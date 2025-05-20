
import React, { useEffect } from 'react';
import { Task } from '@/types';
import TaskDetailsModal from '@/components/task/TaskDetailsModal';
import { useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onRestore }) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Apply fixed positioning to body with current scroll offset
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      
      return () => {
        // Restore scrolling when component unmounts or modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
  
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
      isFullScreen={true}
      className="z-[100]" // Higher z-index to stay above mobile menu
    />
  );
};

export default TaskModal;
