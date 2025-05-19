import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCardHeader from '../TaskCardHeader';
import TaskCardExpanded from './TaskCardExpanded';
import TaskModals from './TaskModals';
import { getTaskPriorityClass } from '@/utils';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useTaskToasts } from './utils/taskToasts';
import useTaskAnimations from '@/hooks/useTaskAnimations';
import './task-card.css'; // Importamos o arquivo CSS

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  
  const { state } = useAppContext();
  const { showHiddenTasks, viewMode, dateDisplayOptions } = state;
  const { toggleTaskHidden, updateTask } = useTaskDataContext();
  const { showToggleHiddenToast } = useTaskToasts();
  const { animationClass, isPendingVisibilityUpdate, animationState } = useTaskAnimations(task);
  
  // Update titleValue when task changes
  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);
  
  // Determinar classes de estilo com base no modo e status da tarefa
  let cardClass = viewMode === 'chronological' 
    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700' 
    : getTaskPriorityClass(task.totalScore);
  
  // Aplicar estilo "Potência Extra" se estiver ativado e no modo potência
  if (viewMode === 'power' && task.is_power_extra && task.totalScore >= 14) {
    cardClass += ' task-power-extra';
  }
  
  
  // Card expansion handler
  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditingTitle) return;
    onToggleExpand(task.id);
  };

  // Title related handlers
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    if (titleValue.trim() !== task.title) {
      updateTask(task.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (titleValue.trim() !== task.title) {
        updateTask(task.id, { title: titleValue.trim() });
      }
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(task.title);
      setIsEditingTitle(false);
    }
  };

  // Action-related functions
  const handleCollapseTask = () => {
    onToggleExpand(task.id);
  };

  const handleExpandedContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskHidden(task.id);
    // O toast será mostrado pela mutação após a operação bem-sucedida
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTaskModalOpen(true);
  };

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedbackModalOpen(true);
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmModalOpen(true);
  };
  
  // Novo handler para alternar o estado de Potência Extra
  const handleTogglePowerExtra = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Atualizar a propriedade is_power_extra
    updateTask(task.id, { is_power_extra: !task.is_power_extra });
  };

  // Verificar se deve mostrar o botão de Potência Extra (apenas para tarefas com pontuação >= 14)
  const showPowerExtraButton = task.totalScore >= 14;

  // Conteúdo de título com indicador de Potência Extra quando ativado
  const renderTitleContent = () => {
    if (viewMode === 'power' && task.is_power_extra && task.totalScore >= 14) {
      return (
        <>
          <span className="power-extra-indicator" aria-hidden="true"></span>
          {task.title}
        </>
      );
    }
    return task.title;
  };

  return (
    <>
      <motion.div
        layout
        layoutId={`task-card-${task.id}`}
        className={`task-card ${cardClass} ${task.completed ? 'opacity-50' : ''} ${animationClass} relative cursor-pointer`}
        onClick={handleCardClick}
        data-task-id={task.id}
        data-animation-state={animationState}
        data-pending-update={isPendingVisibilityUpdate}
        transition={{ 
          layout: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95, 
          y: -10,
          transition: { duration: 0.3, ease: "easeInOut" }
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
              onTogglePowerExtra={handleTogglePowerExtra}
              isPowerExtra={task.is_power_extra}
              showPowerExtraButton={showPowerExtraButton}
              handleExpandedContentClick={handleExpandedContentClick}
              viewMode={viewMode}
              onCollapseTask={handleCollapseTask}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <TaskModals 
        task={task}
        editTaskModalOpen={editTaskModalOpen}
        feedbackModalOpen={feedbackModalOpen}
        deleteConfirmModalOpen={deleteConfirmModalOpen}
        onCloseEditModal={() => setEditTaskModalOpen(false)}
        onCloseFeedbackModal={() => setFeedbackModalOpen(false)}
        onCloseDeleteModal={() => setDeleteConfirmModalOpen(false)}
      />
    </>
  );
};

export default TaskCard;
