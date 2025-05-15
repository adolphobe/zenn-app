
import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { getTaskPriorityClass } from '@/utils';
import TaskPillarDetails from './TaskPillarDetails';
import TaskCardHeader from './TaskCardHeader';
import TaskCardActions from './TaskCardActions';
import PostCompletionFeedback from './PostCompletionFeedback';
import TaskForm from './TaskForm';
import TaskComments from './TaskComments';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const { toggleTaskCompleted, toggleTaskHidden, updateTaskTitle, state } = useAppContext();
  const { dateDisplayOptions, showHiddenTasks } = state;
  const priorityClass = getTaskPriorityClass(task.totalScore);
  
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    if (titleValue.trim() !== task.title) {
      updateTaskTitle(task.id, titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (titleValue.trim() !== task.title) {
        updateTaskTitle(task.id, titleValue.trim());
      }
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(task.title);
      setIsEditingTitle(false);
    }
  };

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedbackModalOpen(true);
  };

  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskHidden(task.id);
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTaskModalOpen(true);
  };

  const handleFeedbackConfirm = (feedbackType: string) => {
    // In a future implementation, we would store the feedback
    // For now, just complete the task
    toggleTaskCompleted(task.id);
    setFeedbackModalOpen(false);
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalOpen(false);
  };

  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  return (
    <>
      <div
        className={`task-card ${priorityClass} ${task.completed ? 'opacity-50' : ''} relative cursor-pointer`}
        onClick={() => !isEditingTitle && onToggleExpand(task.id)}
      >
        <TaskCardHeader 
          title={task.title}
          totalScore={task.totalScore}
          idealDate={task.idealDate}
          isEditing={isEditingTitle}
          titleValue={titleValue}
          dateDisplayOptions={dateDisplayOptions}
          isHidden={task.hidden}
          showHiddenTasks={showHiddenTasks}
          onTitleClick={handleTitleClick}
          onTitleChange={handleTitleChange}
          onTitleBlur={handleTitleBlur}
          onTitleKeyDown={handleTitleKeyDown}
        />

        {isExpanded && (
          <div className="mt-4 animate-fade-in">
            <TaskPillarDetails task={task} />
            
            {/* Display comments if they exist */}
            {task.comments && task.comments.length > 0 && (
              <div className="mt-4">
                <TaskComments taskId={task.id} comments={task.comments} />
              </div>
            )}
            
            <TaskCardActions 
              isHidden={task.hidden}
              onToggleHidden={handleToggleHidden}
              onEditTask={handleEditTask}
              onCompleteTask={handleCompleteTask}
            />
          </div>
        )}
      </div>

      <PostCompletionFeedback
        task={task}
        isOpen={feedbackModalOpen}
        onClose={handleFeedbackCancel}
        onConfirm={handleFeedbackConfirm}
      />
      
      {editTaskModalOpen && (
        <TaskForm
          onClose={() => setEditTaskModalOpen(false)}
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
    </>
  );
};

export default TaskCard;
