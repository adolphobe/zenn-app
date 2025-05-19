
import React from 'react';
import { Task } from '@/types';
import EditTaskModal from './EditTaskModal';
import PostCompletionFeedback from '../PostCompletionFeedback';
import DeleteTaskConfirmation from '../DeleteTaskConfirmation';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';

interface TaskModalsProps {
  task: Task;
  editTaskModalOpen: boolean;
  feedbackModalOpen: boolean;
  deleteConfirmModalOpen: boolean;
  onCloseEditModal: () => void;
  onCloseFeedbackModal: () => void;
  onCloseDeleteModal: () => void;
}

const TaskModals: React.FC<TaskModalsProps> = ({
  task,
  editTaskModalOpen,
  feedbackModalOpen,
  deleteConfirmModalOpen,
  onCloseEditModal,
  onCloseFeedbackModal,
  onCloseDeleteModal
}) => {
  const { toggleTaskCompleted, setTaskFeedback } = useTaskDataContext();

  // Log the task state when the feedback modal is opened
  React.useEffect(() => {
    if (feedbackModalOpen) {
      logDiagnostics('TaskModals', `Feedback modal opened for task ${task.id} (${task.title})`);
      logDateInfo('TaskModals', 'Current task completedAt', task.completedAt);
    }
  }, [feedbackModalOpen, task]);

  const handleFeedbackConfirm = (feedbackType: 'transformed' | 'relief' | 'obligation') => {
    logDiagnostics('TaskModals', `Feedback confirmed: ${feedbackType} for task ${task.id}`);
    
    // First ensure the task is marked as complete if it's not already
    if (!task.completed) {
      logDiagnostics('TaskModals', `Task ${task.id} not completed, marking as completed first`);
      toggleTaskCompleted(task.id);
    }
    
    // Small delay to ensure the completion state is updated before setting feedback
    setTimeout(() => {
      logDiagnostics('TaskModals', `Setting feedback ${feedbackType} for task ${task.id}`);
      
      // Then save the feedback
      if (setTaskFeedback) {
        setTaskFeedback(task.id, feedbackType);
      }
      
      onCloseFeedbackModal();
    }, 300);
  };

  return (
    <>
      {feedbackModalOpen && (
        <PostCompletionFeedback
          task={task}
          isOpen={feedbackModalOpen}
          onClose={onCloseFeedbackModal}
          onConfirm={handleFeedbackConfirm}
        />
      )}
      
      {editTaskModalOpen && (
        <EditTaskModal
          task={task}
          isOpen={editTaskModalOpen}
          onClose={onCloseEditModal}
        />
      )}
      
      <DeleteTaskConfirmation
        task={task}
        isOpen={deleteConfirmModalOpen}
        onClose={onCloseDeleteModal}
      />
    </>
  );
};

export default TaskModals;
