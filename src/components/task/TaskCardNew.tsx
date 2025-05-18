import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { getTaskPriorityClass } from '@/utils';
import TaskCardHeader from '../TaskCardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCardExpanded from './TaskCardExpanded';
import PostCompletionFeedback from '../PostCompletionFeedback';
import TaskForm from '../TaskForm';
import DeleteTaskConfirmation from '../DeleteTaskConfirmation';
import { useTaskDataContext } from '@/context/TaskDataProvider';

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
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const { state, updateTaskTitle } = useAppContext();
  const { toggleTaskHidden, toggleTaskCompleted, setTaskFeedback } = useTaskDataContext();
  const { dateDisplayOptions, showHiddenTasks, viewMode } = state;
  
  // Aplicar classe de prioridade apenas no modo potência
  // No modo cronológico, usar um estilo neutro claro
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
    console.log('Ocultar/Mostrar tarefa clicado:', task.id, 'Status atual:', task.hidden);
    toggleTaskHidden(task.id);
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTaskModalOpen(true);
  };
  
  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmModalOpen(true);
  };

  const handleFeedbackConfirm = (feedbackType: 'transformed' | 'relief' | 'obligation') => {
    // Primeiro marcamos a tarefa como completa
    toggleTaskCompleted(task.id);
    
    // Depois salvamos o feedback
    if (setTaskFeedback) {
      setTaskFeedback(task.id, feedbackType);
    }
    
    setFeedbackModalOpen(false);
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalOpen(false);
  };

  // Determine if task is overdue
  const parsedDate = task.idealDate ? safeParseDate(task.idealDate) : null;
  const isOverdue = parsedDate ? isTaskOverdue(parsedDate) : false;

  // Collapse function to pass to TaskCardExpanded
  const handleCollapseTask = () => {
    onToggleExpand(task.id);
  };

  // Manipulador para expansão do card
  const handleCardClick = (e: React.MouseEvent) => {
    // Se estivermos editando o título, não faremos nada
    if (isEditingTitle) return;
    
    // Chamar a função de toggle
    onToggleExpand(task.id);
  };

  // Manipulador para cliques em áreas expandidas
  const handleExpandedContentClick = (e: React.MouseEvent) => {
    // Impedir a propagação para o card
    e.stopPropagation();
  };

  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  return (
    <>
      <motion.div
        layout
        layoutId={`task-card-${task.id}`}
        className={`task-card ${cardClass} ${task.completed ? 'opacity-50' : ''} relative cursor-pointer`}
        onClick={handleCardClick}
        data-task-id={task.id}
        transition={{ 
          layout: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2 }
        }}
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

        <AnimatePresence initial={false}>
          {isExpanded && (
            <TaskCardExpanded 
              task={task}
              onToggleHidden={handleToggleHidden}
              onEditTask={handleEditTask}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              handleExpandedContentClick={handleExpandedContentClick}
              viewMode={viewMode}
              onCollapseTask={handleCollapseTask}
            />
          )}
        </AnimatePresence>
      </motion.div>

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
      
      <DeleteTaskConfirmation
        task={task}
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
      />
    </>
  );
};

export default TaskCard;
