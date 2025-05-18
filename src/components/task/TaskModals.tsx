
import React from 'react';
import { Task } from '@/types';
import TaskForm from '../TaskForm';
import PostCompletionFeedback from '../PostCompletionFeedback';
import DeleteTaskConfirmation from '../DeleteTaskConfirmation';
import { useTaskDataContext } from '@/context/TaskDataProvider';

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

  const handleFeedbackConfirm = (feedbackType: 'transformed' | 'relief' | 'obligation') => {
    // Primeiro marcamos a tarefa como completa
    toggleTaskCompleted(task.id);
    
    // Depois salvamos o feedback
    if (setTaskFeedback) {
      setTaskFeedback(task.id, feedbackType);
    }
    
    onCloseFeedbackModal();
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
        <TaskForm
          onClose={onCloseEditModal}
          initialData={{
            title: task.title,
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore,
            idealDate: task.idealDate
          }}
          taskId={task.id}
          task={task}
          isEditing={true}
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
