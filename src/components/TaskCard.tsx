
//src/components/TaskCard.tsx
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
  const { toggleTaskCompleted, toggleTaskHidden, updateTaskTitle, state, setTaskFeedback } = useAppContext();
  const { dateDisplayOptions, showHiddenTasks, viewMode } = state;
  
  // Only apply priority class in power mode
  // In chronological mode, use a neutral light style
  const cardClass = viewMode === 'chronological' 
    ? 'bg-white text-gray-800 border-gray-200' 
    : getTaskPriorityClass(task.totalScore);
  
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

  const handleFeedbackConfirm = (feedbackType: 'transformed' | 'relief' | 'obligation') => {
    // Primeiro marcamos a tarefa como completa
    toggleTaskCompleted(task.id);
    
    // Depois salvamos o feedback (importante ser nessa ordem para garantir que ambos os dados sejam atualizados)
    if (setTaskFeedback) {
      setTaskFeedback(task.id, feedbackType);
    }
    
    setFeedbackModalOpen(false);
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalOpen(false);
  };

  // Manipulador para expansão do card que verifica se o clique veio de um elemento na área de conteúdo expandido
  const handleCardClick = (e: React.MouseEvent) => {
    // Se estivermos editando o título, não faremos nada
    if (isEditingTitle) return;
    
    // Chamar a função de toggle
    onToggleExpand(task.id);
  };

  // Manipulador para cliques em áreas expandidas
  const handleExpandedContentClick = (e: React.MouseEvent) => {
    // Impedir a propagação para o card, assim o card não vai colapsar quando clicamos no conteúdo
    e.stopPropagation();
  };

  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  return (
    <>
      <div
        className={`task-card ${cardClass} ${task.completed ? 'opacity-50' : ''} relative cursor-pointer`}
        onClick={handleCardClick}
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
          consequenceScore={task.consequenceScore}
          prideScore={task.prideScore}
          constructionScore={task.constructionScore}
        />

        {isExpanded && (
          <div 
            className="mt-4 animate-fade-in" 
            onClick={handleExpandedContentClick}
          >
            <TaskPillarDetails task={task} />
            
            {/* Display comments if they exist - shown in both modes */}
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
              viewMode={viewMode}
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
